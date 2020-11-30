						STACKS AND TECHNOLOGIES
					
Frontend : 
	1) HTML and CSS
	2) React, redux ( as a global store )
	3) Many third part libraries like redux toastr, redux form, localtunnel etc.
	
Backend :
	1) PHP as a backend environment
	2) MongoDB as a database ( I search everywhere for MySql but I didn't get it. I even tried to use AWS MySql but there was a cost related to it. That's why I used 					   mongoDB. I am very deeply sorry for that )
	3) NodeJs and postman to fetch data from the CodeChef API.

                                               CodeMate ( APP NAME )
                                                          

This is an internship project which focuses mainly on the problem's pages. There are 2 separate pages ( like codechef ) for problems. First page shows you questions distributed section wise ( easy, medium, hard etc ) with a beautiful pagination option. Second page will let you choose your favourite problems according to the tag(s) you provide. There are start ( landing ) and profile pages too. Lets discuss about problem pages.


1) Search problem according to the difficulty level : 

	You can distribute your problems according the difficulty levels. There are 6 such levels : school, easy, medium, hard, challenge and peer. These are in the ascending 		order of difficulty i.e first one least difficult and last one is worst. Problems are showm in a well structured table. You can click on problem to know more about it.

2) Search problem by Tags : 

	This module will display all the tags that are available. You can, anytime, filter the tags with the options availabe like you can see only those tags that are authors. 
	To filter out the tags there are switches ( author, concepts and private tags ( if your are logged in ) ) which you can either keep them "on" or "off". Concepts tag
	will include all those tags that are realated to the question's topics ( like dp, dfs etc ). 

	There is a search bar available which accepts both single and multiple tags and fetch all problems that includes all these tags. Our seach bar works on "AND" rather
	than on "OR". It means it will only fetch those problems that includes all the tags ( both system and user defined ) which are provided by the user. If you are logged
	in then you will see separate switch for the user defind tags. This section will have all the tags that are defined by the user.

	There is a "ADD TAG" button which lets you add your own tag to the problem. Remember that these user defined tags are user specific and will not be visible to others. 		But to use this feature you have to be logged in.


There are other features also like to show the error there is modal, to display each and every activites of yours there is a pop up with different colors ( red for danger, green 
for success , yellow for warning ) and many more.
