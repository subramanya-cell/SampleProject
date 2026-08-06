Jenkins

Steps and explanation:

Jenkins is a server which can be used for automating CI/CD pipeline tasks.
So the idea is basically we need to 1st create a job in the Jenkins website.

So a job is a set of commands to be run by the Jenkins server.

So to create an event/job follow these steps:

1.) So 1st we need to have a repository in GitHub or Bitbucket or any such version control management platforms.

2.) Now in Jenkins, in the DASHBOARD, we will have a drawer menu. In that click on

3.) So we get a field to enter the Job name and type of job, I selected “Free style Project” as my initial sample Job. Click OK

4.) Once the job is created, we are now in Dashboard -> <JobCreated>.
So now in the left drawer we see CONFIGURE, click on that.

5.) Dashboard -> <JobCreated> -> Configuration
Here we can configure the job to run builds manually or automate it.
You can check/click on the options suitable for you.
But this is what I did for my sample project.

6.) Also for the Jenkins to manage and be able to execute git commands and do git related operations, we need to set the Path to Git executables in Jenkins. For this go to:

Dashboard -> Manage Jenkins -> Tools

Under this we have a section called “Git Installations”.
Add the name and then add the PATH to GIT EXECUTABLES.
To get value for the git path, you can use the command:
COMMAND: which git

In which server the Jenkins is running, we have to get the path of the git in that server.
If it was in my system, then it would be - /usr/bin/git
It would be different in Windows or Linux and other systems.
In my office system, it is - git.exe

Then click on APPLY and SAVE.

Steps to run a build (run the set of tasks) manually:
1.) Add description
2.) Go to SOURCE CODE MANAGEMENT.
3.) We have to click on “Git”.
4.) Here add repo details. The repo HTTPS link should be added here. In my case it is “https://github.com/subramanya-cell/SampleProject.git”.
5.) Then add the value for “Branches to build”. Since this is a manual process, you can directly add the branch name which you want to build for. You can add multiple branches here since it is manual process. In my case branch name is “branch1”
6.) Then go down to the “Build Steps”. Select the kind of steps you want to use. In this case it was “Execute windows batch command” (Because my Jenkins server was running on Windows system)
Write command you want to execute in the Commands field.
Example:
echo Hello World
call npm install
7.) Click on APPLY and SAVE
8.) Now it takes back to Dashboard -> <JobCreated>
9.) Now open left drawer and click on “Build Now”.
10.) Observe the BUILD section below in the left drawer. Right click on the build that is running and open the new window.
11.) Check the “Status” and “Console Output” to get the proper output of build errors or success status.

Steps to automate the whole process:
1.) Add description
2.) Go to SOURCE CODE MANAGEMENT.
3.) We have to click on “Git”.
4.) Here add repo details. The repo HTTPS link should be added here. In my case it is “https://github.com/subramanya-cell/SampleProject.git”.
5.) Now we need to add variables in POST CONTENT PAREMETERS
6.) Go to the TRIGGERS section and click on “Generic Webhook Trigger”
7.) Here you can click on ADD to add a variable.

Why variable? Because this is basically what the Jenkins will use to fetch the data from the Github or Bitbucket when the code is pushed.
So basically whenever the code is pushed to the repo, there is a JSON data sent by the bitbucket/github to the Jenkins server. The structure would be somewhat like this:

Example:
For Bitbucket:

{
"pullrequest":
{ "source":
{ "branch":
{ "name": "feature/login" }
}
}
},
"push": {
"changes": [
{ "new": { "name": "develop" } }
]
}
}

For Github:
{
"ref": "refs/heads/develop",
"before": "abc123",
"after": "def456",
"repository": {
"id": 123456,
"name": "AwesomeApp",
"full_name": "Subramanya/AwesomeApp",
"private": true
},
"pusher": {
"name": "Subramanya",
"email": "sub@example.com"
},
"sender": {
"login": "Subramanya",
"id": 987654
},
"action": "opened",
"number": 24,
"pull_request": {
"title": "Login Feature",
"head": {
"ref": "feature/login",
"sha": "abc123"
},
"base": {
"ref": "develop"
}
}

This is the kind of JSON data that will be sent.

Now the way how the Jenkins server gets to know from which repo’s which branch the data is being pushed is via the POST CONTENT PARAMETERS that we add.

So assume if I am doing this in GitHub, and I want to define the branch variable, enter as below:

Variable (name of variable) - branch (This can be anything, but we will be using this later)
Expression - ref (in case of GitHub)
ORExpression - push.changes[0].new.name (in case of BitBucket)

(NOTE: we are defining this variable for a code push action. If we are doing if for a pull request action or something we can get it via this - pullrequest.source.branch.name in BitBucket)

Also click on the option - JSONPath

8.) Many variables can be created as per your requirement. Here we showed 1 for branch. We can do the same for repository and other stuff required.

9.) Now go below, there is a section called “Token”.
You can add a string here that can be considered as a token which will be used later.
Im using the value - “sample-project-trigger”

10.) Then add the value for “Branches to build”. Since this is a manual process, you can directly add the branch name which you want to build for. You can add multiple branches here since it is manual process. In my case branch name is “$branch”.

11.) Then go down to the “Build Steps”. Select the kind of steps you want to use. In this case it was “Execute windows batch command” (Because my Jenkins server was running on Windows system)
Write command you want to execute in the Commands field.
Example:
echo Hello World
call npm install

12.) Click on APPLY and SAVE
13.) Now it takes back to Dashboard -> <JobCreated>

14.) Now go to GitHub / BitBucket so that we can configure the Webhook in the GitHub(in my case).
Why webhook?

    Because web hook is what basically defines,
    1.) Where to send the JSON data on trigger in GitHub,
    2.) What event to trigger the job in Jenkins

And based on this trigger, the Generic web hook trigger in the Jenkins side will receive the JSON data sent by the GitHub. And the variables defined in the Post content Parameter via the generic web hook trigger will fetch for the branch name, repo name etc. and that will trigger a build process.

15.) In order for creating a webhook follow below steps:
Go to Github -> Repository -> Settings -> Webhooks -> Add Webhook

    In that section add the below values:
    1.) Payload URL
    	For this basically this is the Jenkins URL
    	Pattern:
    	<Jenkins URL>/generic-webhook-trigger/invoke?token=<token>
    	In My Case it is:
    	http://10.32.55.18:8080/generic-webhook-trigger/invoke?token=sample-project-trigger

    	This token is basically the one that was defined by us in the Generic Webhook trigger.

    2.) Content Type - application/JSON
    3.) Events
    We can decide to choose different kind of events.
    But in my case I only decided to trigger for push events.

16.) Now click on Add Webhook
17.) Now under the web hook section, we can see the newly added web hook. If we click on that we can see 2 options, SETTINGS and RECENT DELIVERIES.

18.) RECENT DELIVERIES shows the JSON data that will be sent when every push event occurs in the GitHub.

19.) Now make some changes in the code and commit and push it.
20.) Observe the BUILD section below in the left drawer. Right click on the build that is running and open the new window.
21.) Check the “Status” and “Console Output” to get the proper output of build errors or success status.
=====================================================================

Commands run on Windows or Linux or Ubuntu or Max server on Jenkins side. Based on this, the Command writing style changes.

So on normal system it is:
echo “Hello world”
npm install
yarn install

If the Jenkins is running on Windows server then:
echo Hello world
call npm install
call yarn install
