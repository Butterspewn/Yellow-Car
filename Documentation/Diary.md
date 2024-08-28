# September 2023

### Wednesday 27th

Cloned the git repository to my local machine and created bare bones files for both the diary and the project plan. Changes have been pushed to the remote.

### Thursday 28th

Added to project plan abstract to the point where it is ready for review before submission. Updated the incorrect dates in the diary.

### Saturday 30th

Created first draft of project timeline.

# October 2023

### Sunday 1st

Filled out the project plan according to the marking grid. All is missing is the bibliography.

### Tuesday 3rd

Implemented suggested changes to first draft and added citations

### Monday 9th

Created basic main page foundation and customised a bit.

### Friday 13th

Added navbar component.

### Saturday 14th

Added ability to customised bootstrap sass variables, conditionally render login/signup buttons depending on loggedIn variable

### Sunday 15th

Restructured project to better implement backend files and allow for separate installation of node modules. Created basic placeholder api.

### Saturday 21st

Setup system to connect to database and perform queries.

### Sunday 22nd

Data can now be fetched from the database using an api call and return as a json

### Saturday 28th

Fixed issues with displaying favicon and navbar logo. Introduced issues with node modules, best course of action may be to create a fresh project and copy over all of own code.

### Sunday 29th

Rebuilt react project and setup jest testing for the backend. Created set of functions which return sql queries.

### Monday 30th

Changed method of accessing database. Now uses parameterised queries with built in SQL injection protections. New tests to acompany. A handful of cases to handle get request using the new methods have been created.

# November 2023

### Wednesday 1st

Added error handling and reporting to database query methods. Changed the way the frontend dynamically changes contents and implemented functionality to insert new userse into the database.

### Saturday 11th

Styled the navbar, body, and login page. Can now swap login to signup mode.

### Sunday 12th

Passed down function as prop to allow swapping between login and signup screens. Created basic post and postlist components. Login is now functional to an extent.

### Sunday 19th

Updated styling of post elements

### Monday 20th

Changed to use react router to swap between pages. Updated database functions and tests to return more useful information.

### Saturday 25th

Now supports uploading images to the server. password hashing and salt generation now working.

### Sunday 26th

Reworked functions and tests regarding logins and sessions. logins, signups, and redirects work now.

# December

### Monday 4th

Images can now be uploaded from front end.

### Tuesday 5th

Specific images can now be displayed on the feed.

### Sunday 17th

created database table for posts and api endpoint which allows uploading posts. Post images are now visible in the feed. Updating console logging.

# January

### Monday 1st

Removed dash from sign up.

### Saturday 20th

Added error handling to login and signup, fixed bug which double rendered posts on feed, images can now be uploaded from profile page.

### Tuesday 23rd

Messed around more with the look of the feed, should be good enough for now however is not final.

### Wednesday 24th

Added automatic redirect from feed and profile when not logged in.

### Sunday 28th

Comments can now be displayed under posts. Still need to add ability to post comments and rework the way usernames are retrieved.

# February

### Saturday 3rd

Created new components and changed file sctructure to accomodate them. Changed naming convention of the database again to remove ambiguity. May need to rethink the way i have created the backend application as it is progressively becoming harder to maintain and change.

### Wednesday 14th

Recreated all database functions to me more atomic. Created tests to test a large quantity of data. Need to now make more complex server functions utilising the more basic database functions in order to perform validation and so on.

### Thursday 15th

Added explicite typing to database functions. About half of the server functions are working, error handling needs to be explored further throughout whole system. Need to implement check for duplicate emails and tokens.

### Sunday 18th

Added checks for existing emails and tokens before inserting assuring there will never be duplicates. Made HTTP requests send more useful responses for error handling.

### Sunday 25th

Posts now retrieve user information to display automatically. Comments can be uploaded and refresh in real time. The logged in status indicator now uses profile picture when logged in.

# March

### Saturday 2nd

Leadboard is now functioning, still yet to create link to page in navbar. Users now gain 1 score for uploading a post.

### Sunday 3rd

Button to access leaderboard was added to navbar. Images posted by the user are now displayed on thier profile. All styling ideally needs to be revised. May not have enough time to implement all wanted features such as friends, post deletion, inspection of other profiles, post verification, user info changing.

### Saturday 9th

Updated styling accross site, particularly the profile page.

### Sunday 10th

Added ability to change account info from profile page. Commented database, crypto and server files. Added comments for all components.
