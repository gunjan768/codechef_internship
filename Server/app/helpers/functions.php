<?php

	function debug_r($data, $die_flag = TRUE, $return_flag = FALSE)
	{
	    if($return_flag) 
	    {
	        return '<pre>' . print_r($data, TRUE) . '</pre>';
	    } 
	    else 
	    {
	        echo '<pre>';
	        print_r($data);
	        echo '</pre>';
	    }

	    if($die_flag) 
	    {
	        die;
	    }
	}

	function app()
	{
	    return new class
	    {
	        public function version()
	        {
	            return '5.4';
	        }
	    };
	}

?>