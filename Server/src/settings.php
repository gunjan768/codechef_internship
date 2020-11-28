<?php

	$env = new Dotenv\Dotenv(__DIR__ . '/../');
	$env->load();
	$env->required(['DB_CONNECTION', 'DB_HOST']);

	return 
	[
	    'settings' => 
	    [
	        'displayErrorDetails'    => getenv('DISPLAY_ERROR_DETAILS') ?? FALSE,
	        'addContentLengthHeader' => FALSE,
	        'debug'                  => getenv('APP_DEBUG') ?? FALSE,

	        'logger'                 => [
	            'name'  => 'slim-app',
	            'path'  => !empty(getenv('DOCKER')) ? 'php://stdout' : __DIR__ . '/../logs/app.log',
	            'level' => \Monolog\Logger::DEBUG,
	        ],

	        'db' => 
	        [
	            'mongodb' => 
	            [
	                'driver'   => 'mongodb',
	                'host'     => getenv('DB_HOST') ?? 'localhost',
	                'port'     => getenv('DB_PORT') ?? 27017,
	                'database' => getenv('DB_DATABASE') ?? 'db',
	                'username' => getenv('DB_USERNAME') ?? '',
	                'password' => getenv('DB_PASSWORD') ?? '',
	            ],
	        ],
	    ],
	];

?>