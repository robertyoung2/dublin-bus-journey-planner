# Connecting Jupyter Notebook via the VM for the Dataset

The dataset for our project is stored and maintained on the UCD server. The data cannot be removed from the server due to legal requirements. To view this data via Jupyter Notebook on the UCD VM requires to steps to achieve:

### Step 1
Login to the server using ssh. To start Jupyter notebook on the server use this command: 

`` jupyter notebook --no-browser ``

### Step 2
With Jupyter now running (without a web browser interface on the VM, as it does not have one) you now need to connect one of the ports on your local machine to the port on the VM where Jupyter is. On your local machine, run the following command: 

``ssh -NfL 9999:localhost:8888 Witheld``

and enter the server password.

Port 9999 on your local machine is now mapped to port 8888 on the VM, which is the default port for Jupyter. Open up your web-browser and navigate to:

``http://localhost:9999/``

Sometimes you will be asked for a Jupyter token, you will see this in the terminal for the VM when you launched Jupyter. Copy and paste this token into the browser text input field. 
You should now be in Jupyter Notebook!

When finished, in the VM terminal use the command “ctrl+c” and then type and enter “yes” to close Jupyter Notebook.

To exit the VM connection, in the VM terminal enter the command “exit”.

 