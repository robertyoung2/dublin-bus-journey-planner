# Information and tips about using Django - _Version 1.0_

#### Authored by - Robert Young
<br/>

### Connecting to the MySql Server on the UCD Server via SSH

Our MySql server is hosted on the UCD server. While running and testing Django from the withing the server environment, Django can connect to the MySql database as it is 'local' to it. However, when testing and developing locally, the MySql database will no longer be local to our Django project, and it will be behind a proxy on our VM.

To handle this, we need to do two things to allow local development and connection to the MySql server. First, we need to make an ssh tunnel to our MySql server, so one of the ports on our machine is listening to the MySql port on the server. This is done in the settings.py file for Django. I have made these changes readily available to the team on the code on Github.

The settings when running Djanog on the server should be as follows:

```
# This is the setting that should be pushed to the server (leave uncommented)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': ***REMOVED***,
        'USER': ***REMOVED***,
        'PASSWORD': ***REMOVED***,
        'HOST': '137.43.49.51',
        'PORT': '3306',
    }
}
```
When developing locally, the above code should be commented out, and you should use the below code to be able connect to the database locally. Also note the final comment which describes how to map your ports using ssh tunneling. This step should be carried out **before** you start to run the Djano application locally.

```
# This database setting should only be used for local test and development
# Ensure this is not used on the server
# To set up an ssh tunnel to work with database locally do the following:
# ssh -L 3333:127.0.0.1:3306 Witheld

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': ***REMOVED***,
        'USER': ***REMOVED***,
        'PASSWORD': ***REMOVED***,
        'HOST': '127.0.0.1',
        'PORT': '3333',
    }
}

```

Both these code snippets are already contained in the settings.py file. All that is required is that you comment and uncomment as required. Also ensure to run the ssh tunnel command before starting the Django server. 