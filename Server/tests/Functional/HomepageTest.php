<?php

	namespace Tests\Functional;

	class HomepageTest extends BaseTestCase
	{
	    public function testGetHomepageWithoutName()
	    {
	        $response = $this->runApp('GET', '/');

	        $this->assertEquals(200, $response->getStatusCode());
	        $this->assertContains('SlimFramework', (string)$response->getBody());
	        $this->assertNotContains('Hello', (string)$response->getBody());
	    }

	   
	    public function testGetHomepageWithGreeting()
	    {
	        $response = $this->runApp('GET', '/name');

	        $this->assertEquals(200, $response->getStatusCode());
	        $this->assertContains('Hello name!', (string)$response->getBody());
	    }

	    public function testPostHomepageNotAllowed()
	    {
	        $response = $this->runApp('POST', '/', ['test']);

	        $this->assertEquals(405, $response->getStatusCode());
	        $this->assertContains('Method not allowed', (string)$response->getBody());
	    }
	}

?>