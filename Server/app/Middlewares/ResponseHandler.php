<?php

	namespace App\Middlewares;

	use App\Core\StatusCodes;
	use Psr\Http\Message\ServerRequestInterface as Request;
	use Psr\Http\Message\ResponseInterface as Response;

	class ResponseHandler
	{
	    function __invoke(Request $request, Response $response, callable $next)
	    {
	        $response = $next($request, $response);

	        if(StatusCodes::isError($response->getStatusCode()) && StatusCodes::canHaveBody($response->getStatusCode())) 
	        {
	            return $response->withJson(
	                [
	                    'errors' => json_decode($response->getBody()),
	                ]
	            );
	        } 
	        elseif(StatusCodes::isError($response->getStatusCode())) 
	        {
	            return $response;
	        }

	        return $response->withJson(
	            json_decode($response->getBody()),
	            $response->getStatusCode()
	        );
	    }
	}

?>