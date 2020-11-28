<?php

	namespace App\Traits;

	use Sirius\Validation\Validator;

	trait Validation
	{
	    public function getValidationMessages(Validator $validator)
	    {
	        $messages = [];

	        foreach ($validator->getMessages() as $rule => $message) 
	        {
	            foreach($message as $item) 
	            {
	                $messages[$rule] = (string)$item;
	            }
	        }

	        return $messages;
	    }
	}

?>