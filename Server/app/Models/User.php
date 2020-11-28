<?php

	namespace App\Models;

	use Jenssegers\Mongodb\Eloquent\Model;
	use Sirius\Validation\Validator;

	class User extends Model
	{
	    protected $collection = 'users';

	    protected $fillable = 
	    [
	        'firstName',
	        'lastName',
	        'email',
	        'username',
	        'created_at',
	        'updated_at',
	    ];

	    public static function validator()
	    {
	        $validator = new Validator();
	        $validator->add(
	            [
	                'first_name:First Name' => 'required',
	                'last_name:Last Name'   => 'required',
	                'email:Email'           => 'required | email',
	                'username:Username'     => 'required',
	            ]
	        );

	        return $validator;
	    }
	}

?>