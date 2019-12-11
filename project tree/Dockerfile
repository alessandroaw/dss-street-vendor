FROM tiangolo/uvicorn-gunicorn:python3.6

# Make directories suited to your application
RUN mkdir -p /home/DSS/dss-street-vendor/project
WORKDIR /home/DSS/dss-street-vendor/project

# Copy and install requirements
COPY requirements.txt /home/DSS/dss-street-vendor/project
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy contents from your local to your docker container
COPY . /home/DSS/dss-street-vendor/project
COPY ./notebooks/ /notebooks
COPY ./app /app 

