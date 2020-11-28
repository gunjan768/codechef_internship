<?php

	namespace App\Core;

	use App\Traits\Validation;
	use Psr\Container\ContainerInterface;

	class Controller
	{
	    use Validation;
	   
	    protected $container;
	    protected $settings;
	    protected $router;
	    protected $mongodb;

	    public function __construct(ContainerInterface $container)
	    {
	        $this->container = $container;
	        $this->settings  = $this->container['settings'];
	        $this->router    = $this->container['router'];
	        $this->mongodb   = $this->container['mongodb'];
	    }
	}

?>