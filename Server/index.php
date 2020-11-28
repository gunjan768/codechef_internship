<?php

	use Classes\Auth;
	use Classes\Repository;
	use Classes\Utils;
	use Exceptions\AuthException;
	use Exceptions\CustomException;
	use GuzzleHttp\Client;
	use GuzzleHttp\Exception\BadResponseException;
	use Psr\Http\Message\ServerRequestInterface;
	use Slim\Exception\HttpNotFoundException;
	use Slim\Factory\AppFactory;
	use Slim\Psr7\Request;
	use Slim\Psr7\Response;

	require 'vendor/autoload.php';
	require 'classes/autoload.php';
	require 'exceptions/CustomExceptions.php';

	define("CLIENT_ID", getenv("CODECHEF_CLIENT_ID"));
	define("CLIENT_SECRET", getenv("CODECHEF_CLIENT_SECRET"));
	define("API_URL", "https://api.codechef.com");
	define("REDIRECT_URI", "http://" . $_SERVER['HTTP_HOST'] . "/authorize");
	define("JWT_KEY", getenv("JWT_KEY"));
	define("CACHE_INTERVAL", 60);

	session_start();
	$app = AppFactory::create();
	$repo = new Repository();

	$app->get('/login', function (Request $request, Response $response) 
	{
	    if(empty(CLIENT_ID) || empty(CLIENT_SECRET)) 
	    {
	        throw new CustomException('Configuration is not valid.');
	    }

	    $randomString = Utils::random_str();
	    $_SESSION['state'] = $randomString;
	    $_SESSION['client_redirect'] = $request->getQueryParams()['redirect'];

	    if(empty($_SESSION['client_redirect'])) 
	    {
	        throw new CustomException('Redirect is not set.');
	    }

	    $queryData = 
	    [
	        'response_type' => 'code',
	        'client_id' => CLIENT_ID,
	        'state' => $_SESSION['state'],
	        'redirect_uri' => REDIRECT_URI
	    ];

	    $oauthURL = API_URL . '/oauth/authorize?' . http_build_query($queryData);
	    return $response->withStatus(302)->withHeader('Location', $oauthURL);
	});


	$app->get('/authorize', function (Request $request, Response $response) 
	{
	    $queryParams = $request->getQueryParams();

	    if($queryParams['state'] != $_SESSION['state']) 
	    {
	        throw new CustomException('CSRF alert :(');
	    }

	    $client = new Client();

	    $authResponse = $client->post(API_URL . '/oauth/token', 
	    [
	        'form_params' => 
	        [
	            'grant_type' => 'authorization_code',
	            'code' => $queryParams['code'],
	            'client_id' => CLIENT_ID,
	            'client_secret' => CLIENT_SECRET,
	            'redirect_uri' => REDIRECT_URI
	        ]
	    ]);

	    $authResponse = json_decode($authResponse->getBody())->result->data;

	    $tokenData = 
	    [
	        'access_token' => Auth::getOwnJWT($authResponse->access_token),
	        'refresh_token' => $authResponse->refresh_token
	    ];

	    return $response->withAddedHeader('Location', $_SESSION['client_redirect'] . '?' . http_build_query($tokenData));
	});


	$app->get('/refresh', function (Request $request, Response $response) 
	{
	    $token = Auth::getRefreshToken($request->getQueryParams());
	    $client = new Client();

	    $authResponse = $client->post(API_URL . '/oauth/token', [
	        'form_params' => 
	        [
	            'grant_type' => 'refresh_token',
	            'refresh_token' => $token,
	            'client_id' => CLIENT_ID,
	            'client_secret' => CLIENT_SECRET,
	        ]
	    ]);

	    $authResponse = json_decode($authResponse->getBody())->result->data;

	    $tokenData = 
	    [
	        'access_token' => Auth::getOwnJWT($authResponse->access_token),
	        'refresh_token' => $authResponse->refresh_token
	    ];

	    $response->getBody()->write(json_encode($tokenData));
	    return $response->withAddedHeader('Content-Type', 'application/json');
	});
	
	$RequireAuth = function (Request $request, RequestHandler $handler) 
	{
		$response = $handler->handle($request);
		$response->getBody()->write('World');

		return $response;
	};

	$app->post('/api/tags/',function(), use($app)
	{
		$user_id;

		$db = new dbHandler();

		$problemId = $app->request()->post('problemId');
		$tagName = $app->request()->post('tagName');

		try 
		{
			$foundActualTag = $db->tags->findOne([ 'tag'=> $tagName ]);

			$updateUserTags = null;

			if(!$foundActualTag) 
			{
				$updateUserTags = $db->users->findOneAndUpdate(
					[ '_id'=> $user_id ],
					[
						'$addToSet'=> 
						[
							'tags'=> $tagName,
						]
					]
				);
			}

			$problemTags = $db->problems->findById($problemId, [ '_id'=> 0, 'tags'=> 1 ]);

			$updateProblem = $db->problems->findOneAndUpdate(
				[ '_id'=> $problemId, "userDefinedTags.user_id"=> [ '$eq'=> $user_id ] ],
				[
					'$addToSet'=> 
					[
					"userDefinedTags.$.tags"=> $tagName,
					],
				]
			);

			if($updateProblem == null) 
			{
				$tagArr=$problemTags->tags;
				$tagArr->push($tagName);

				$updateProblem = $db->problems->findByIdAndUpdate(
					$problemId,
					[
						'$push'=> 
						[
							'userDefinedTags'=> 
							[
								'user_id'=> $user_id,
								'tags'=> $tagArr,
							],
						],
					],
					[ 'userDefinedTags'=> 1, '_id'=> 0 ]
				);
			}

			$updateProblem = $db->problems->findOne(
				[ '_id'=> $problemId, "userDefinedTags.user_id"=> [ '$eq'=> $user_id ] ],
				[ '_id'=> 0, 'userDefinedTags'=> 1 ]
			);

			response(200,
			[
				$updateUserTags,
				$updateProblem,
			]);
		} 
		catch(MongoCursorException $err) 
		{
			response(400);
		}
	})->add($RequireAuth);

	$app->post('/api/tags/search_tag',function(), use($app)
	{
		$value = $app->request()->post('value');
		$user_id = $app->request()->post('user_id');
		$db = new dbHandler();

		try 
		{
			$data = $db->tags.find(
				[
					'tag'=> [ '$regex'=> $value, '$options'=> "i" ],
				],
				[
					'_id'=> 0,
					'tag'=> 1,
				]
			).limit(10);
			

			if($user_id != null) 
			{
				$userData = $db->users->aggregate(
				[
					[ '$unwind'=> [ 'path'=> "tags" ] ],
					[
						'$match'=> 
						[ 
							'$and'=> [[ '_id'=> $user_id ], [ 'tags'=> [ '$regex'=> $value ]]],
						],
					],
					[ '$group'=> [ '_id'=> [ 'tags'=>"tags" ]] ],
				]).limit(10);
			}

			return response(200,[ $data, $userData ]);
		} 
		catch(MongoCursorException $error) 
		{
			return respnse(500);
		}
	});

	$app->get('/api/tags/tags/{tagType}/{offset}',function()use($app)
	{
		$tagType = $app->getArgument('tagType');
		$offset = $app->getArgument('offset')*10;
		$db = new dbHandler();

		try 
		{
			$resp =  $db->tag->find([ 'type'=> $tagType ], [ 'tag'=> 1, '_id'=> 0 ])
			.limit(10)
			.skip($offset);

			if($resp) 
			{
				response(400,
				[
					$data=> "No tags found",
				]);
			} 
			else 
			{
				response(200,$resp);
			}
		} 
		catch(MongoCursorException $err) 
		{
			response(400);
		}
	});

	$app->post('/api/problem/{offset}', function() use($app)
	{
		$offset = $app->getArgument('offset') * 20;
		$user_id = $app->request()->post('user_id');
		$tags = $app->request()->post('tags');

		$db = new dbHandler();

		if($user_id === null) 
		{
			try 
			{
				$questions = $db->problems->find(
					[
						'tags'=> [ '$all'=> $tags ],
					],
					[ 'userDefinedTags'=> 0 ]
				)
				.limit(20)
				.skip($offset);

				response(200,$questions);
			} 
			catch(MongoCursorException $err) 
			{
				response(400,$err);
			}
		} 
		else 
		{
			try 
			{
				$questions = $db->problems->find(
				[
					'$or'=> 
					[
						[ 'tags'=> [ '$all'=> $tags] ],
						[
							'$and'=> 
							[
								[ "userDefinedTags.tags"=> [ '$all'=> $tags ] ],
								[ "userDefinedTags.user_id"=> ($user_id) ],
							],
						],
					],
				])
				.limit(20)
				.skip($offset);

				response(200,$questions);
			}
			catch(MongoCursorException $err) 
			{
				response(500,[ $err=> "Error fetching problems" ]);
			}
		}
	});

	$app->post('/api/problem/problem/{problemId}', function() use($app)
	{
		$res = array();
		$problemId = $app->getArgument('problemId');
		$name = $app->request()->post('name');
		$age = $app->request()->post('age');

		$db = new dbHandler();
		$cur = $db->insertFriend($name,$age);

		$user_id = $app->request().post('name');

		if($user_id === null) 
		{
			$tagsObj = $db->problems->findOne(
				[ '_id' => $problemId ],
				[ '_id'=> 0, 'tags'=> 1 ]
			);

			response(200,[ 'tags'=> $tagsObj->tags ]);
		} 
		else 
		{
			$tagsObj = $db->problems.findOne(
				[
					'_id'=> $problemId,
					"userDefinedTags->user_id"=> [ '$eq'=> $user_id ],
				],
				[ "userDefinedTags.$"=> 1, '_id'=> 0 ]
			);

			if($tagsObj) 
			{
				response(200, ['tags'=> $tagsObj->userDefinedTags[0]->tags ]);
			} 
			else 
			{
				$tagsObj = $db->problems.findOne(
					[ '_id'=> $problemId] ,
					[ '_id'=> 0, 'tags'=> 1 ]
				);

				response(200,[ 'tags'=> $tagsObj->tags ]);
			}}
	});


	function response($status, $response) 
	{
		$app = \Slim\Slim::getInstance();

		$app->status($status);
		$app->contentType('application/json');
		echo json_encode($response, JSON_PRETTY_PRINT);
	}

	$customErrorHandler = function (
	    ServerRequestInterface $request,
	    Throwable $exception,
	    bool $displayErrorDetails,
	    bool $logErrors,
	    bool $logErrorDetails
	) 
	use ($app) 
	{
	    $payload = ['error' => $exception instanceof HttpNotFoundException ? $exception->getDescription() : $exception->getMessage()];

	    $response = $app->getResponseFactory()->createResponse();

	    $response->getBody()->write(
	        json_encode($payload, JSON_UNESCAPED_UNICODE)
	    );

	    return $response->withStatus(
	        $exception instanceof BadResponseException ? $exception->getResponse()->getStatusCode()
	            : ($exception instanceof CustomException ? 400
	            : ($exception instanceof AuthException ? 401
	                : ($exception instanceof HttpNotFoundException ? 404 : 500))))
	        ->withAddedHeader('Content-Type', 'application/json');
	};

	$errorMiddleware = $app->addErrorMiddleware(true, true, true);
	$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

	$app->options('/{routes:.+}', function ($request, $response, $args) 
	{
	    return $response;
	});

	$app->add(function ($request, $handler) 
	{
	    $response = $handler->handle($request);
	    
	    return $response
	        ->withHeader('Access-Control-Allow-Origin', '*')
	        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
	        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	});

	$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) 
	{
	    throw new HttpNotFoundException($request);
	});

	$app->run();

?>
