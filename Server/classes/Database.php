<?php

	namespace Classes;
	use PDO;

	class Database
	{
		  public $connection;
		  private $DB_SERVER, $DB_USER, $DB_PASS, $DB_NAME;

		  public function __construct()
		  {
			$this->DB_SERVER = getenv("DB_HOST");
			$this->DB_NAME = getenv("DB_NAME");
			$this->DB_PASS = getenv("DB_PASSWORD");
			$this->DB_USER = getenv("DB_USERNAME");
			$this->connection = $this->connect();
			$this->loadMigrations();
		  }

		  private function connect()
		  {
			$conn = new PDO("mysql:host=$this->DB_SERVER;dbname=$this->DB_NAME", $this->DB_USER, $this->DB_PASS);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			return $conn;
		  }

	    	  function connect() 
		  {
			    include_once dirname(__FILE__) . '/config.php';

			    try 
			    {
				$this->con = new MongoClient(
					"mongodb+srv://gunjan768:emilia12@cluster0.ytodu.mongodb.net/codechef_internship?retryWrites=true&w=majority"
				);

				$this->db = $this->con->selectDB(DB_NAME);
			    }
			    catch(MongoConnectionException $e) 
			    {
				echo "Cannot Connect to MongoDB";
			    }

			    return $this->db;
		  }

	    	  public function getConnection()
	    	  {
	        	return $this->connection;
	    	  }
	}
?>
