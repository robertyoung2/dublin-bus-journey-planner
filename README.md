# Rules for Simple Coding as a Team - _Version 1.0_

#### Authored by - Robert Young
#### Note - Please see .md (Mardown) files on the repo for tips and info.
<br/>

## Code Release Process

1. When developing or working on code, make sure to work off a 'branch' on GitHub. This ensures seperation from the core code base.
2. Ensure each piece of code you have written, as best possible, has a test case for it (goal is to write code with a test driven development approach).
3. When you are finished with your branch, and feel it is ready to be merged with the master, organise a code review with the team.
4. Upon completion of the code review, initiate a pull request for the group, and each team member can sign off on the changes to be merged back to the master.
5. Follow the below design rules when working on code.

## Keep it Simple

Writing code that is simple to read and understand for all members of the team is key. If the choice is between one line of succinct code, or three lines of very readable code, the code should be three lines long for the purpose of readability.

Consider this:
```
return hours < 24 and minutes < 60 and seconds < 60
```

Versus this:
```
if (hours < 24 and minutes < 60 and seconds < 60):
	return true
else:
	return false
```
While the first code block is succinct and short, it runs the risk of increasing the complexity of the code. Its return values, true and false, are implicit. For readability and simplicity the second code block is preferred.

## Architecture is Important

The entire project revolves around the architecture we have selected for our application, and the integration and deployment of this architecture. It is important to take the time to write code that considers the architecture first, even if this takes more time, then rushing code to make it work at that moment in time. When writing the first line of code the key points to consider are:

* What it will do?
* How it will do it?
* What it uses to do it?
* How the modules and services will work with each other?
* How to test and debug this code?
* How it will be updated and changed in the future, if required?

## Naming Convention

Always use descriptive variable and function names when writing code. If it is possible to infer what the variable is for, or what the function does, just from its name, then you have done a good job!

Consider:

```
def calculate_loaded_car_weight():
	driver_weight = 80
	car_weight = 2000
	return driver_weight + car_weight
```

Versus:

```
def weight_1():
	x_1 = 80
	x_2 = 2000
	return x_1 + x_2
```

## Comments

The use of comments is an indicator that the code is complex or of poor quality. We should be able read the code and understand what it does without comments if the code is well written. Comments should only be used in docstrings or for very simple function descriptions. If you find you are writing a lot of comments in your code, this is a sign that you may need to go back and simplify it so that everyone may understand it, without comments!


## Test Driven Development

Unit Tests are programs that are written to test other programs. They are used the verify the expected behaviours of the code to be tested.

Test driven development is important but you should be aware that code with badly written tests can be more harmful than code without tests.

Travis is now integrated with the GitHub repository, which will allow automated testing of the code. To learn more about Travis, how it works, and how to use it, go [here](https://travis-ci.org). Have a read through the documentation and tutorials, particularly those that cover Python and unit testing. To understand unit testing in Django, have a look at the Django [documentation](https://docs.djangoproject.com/en/2.2/topics/testing/overview/), and this [article](https://realpython.com/testing-in-django-part-1-best-practices-and-examples/) on writing unit tests in for Django.

A good place to start if you know very little about unit testing and want to try and get familiar with the basics is [this](https://realpython.com/python-testing) article on Python testing, which also has some information on framework testing including Django. 

## Portability

The code, unless being used locally for testing, should not contain hard-coded values for environmental parameters. Examples of such parameters are:

* Absolute file paths
* File names
* User names
* Host names
* IP addresses

If this were the case, the application would not run on a host with a different layout or design. For our project we should ensure that all environmental parameters used relate to our VM. There should be no local user parameters present in the code.

## Code Reviews

A code review should take place when a team member wishes to merge the work they have carried out to the master branch. As a general rule, code reviews will happen on a Friday, the day of code release. However, should a team member wish to do a review and release  before then, there should be nothing that stops this from occurring sooner, bar team commitments. Best practice rules for a code review:

* The review should be under 400 lines of code at a time. Don't let the amount of code to be reviewed build up, organise reviews before this point!
* It is important to take the time to review the code thoroughly. On average, it should be under 400 lines of code read per hour.
* Code reviews should be limited to 60 minutes in length. Make code reviews a frequent, short routine, not a long irregular one.
* Use metrics to measure the review by, such as inspection rate speed, defect rate (bugs per hour found) and defect density (average number of bugs per line).
* Make sure the author of the code to be reviewed has some annotations and notes coming into the review. This allows them to highlight the key parts of code for review, as well as give reasons for changes to the code.
* Make checklists to identify common or reoccurring mistakes in the code, and build test cases to cover this for future releases.
* Remember we're all part of a team and to be constructive and nice! Like artists, it's hard to see your peers or friends tear your work apart :)


## Refactoring

Do not work with the approach of "this can be refactored later". Always aim to write code that is right first time, easy to understand, and does not require massive changes, deletions or new function implementations to make it work _after_ it has been released. Do not create code that needs to be deleted and re-written numerous times to make it work down the road.

**Red-Green-Refactor**:

* When writing code, stop and think about what needs to be written.
* Write this implementation, and ensure it passes testing.
* Optimise and clean up this code without adding new functionality.

Refactoring should be used during the writing of code, not after it has been pushed to GitHub.


## Iterative Development

Do not write all the code at once, this can be overwhelming and complicated. Make it an iterative process. Work out what the key features/functionality are, select the most valuable features that can be developed well and in a short time. Take an iterative approach to deploy quality updates, a little bit at a time.

