# brunsviga
Code for an API for a mechanical computer (Brunsviga 13RK). Wrapper around a human (or possibly robot) in the loop.

## LICENSE
Licensed under [GPLv3 licence](LICENCE) except for bootstrap and jquery components licensed under the [MIT licence](LICENCE.bootstrap).

## Access
To access the brunsviga as described in the Implementation section below, please check out [brunsviga.io](https://brunsviga.io). Note that I generally keep the Brunsviga 13RK at work, and I have a life outside of work, so don't expect a response to a web request after (Australian Eastern Standard/Daylight Time) work hours.

## Plan
Here's the overall plan
- [x] Provide human-friendly web form for submitting requests.
- [ ] Sanity check human input.
- [x] Use AWS API gateway service to provide a REST API.
- [x] Trigger an AWS lambda function that sends JSON via AWS SNS of operation to be run by a human.
- [x] create s3 bucket for human operator to upload videos of calculations to (using iPhone with [Transmit-iOS](https://panic.com/transmit-ios/) app),
- [X] convert videos to mp4 and then upload, using AWS CloudFront to serve content for faster access. To do: look at AWS Elastic Transcoder for conversion (instead of Photos app on OS X).

then video link is emailed to requestor.

## Implementation
Note: I have removed my specific ID numbers and urls from files referenced, you would need to complete those before using.

1. Define an SNS topic, and subscribe the human operator's email address to that email.
2. Define a lambda function as per [lambda/index.js](lambda/index.js), and give it the lambda_basic_execution role. Then in AWS IAM edit that role and attach a policy as per [lambda/publish_brunsviga_sns_policy.json](lambda/publish_brunsviga_sns_policy.json) to allow the lambda function to publish to the SNS topic. The lambda function takes json from an http POST request of the (stringified) form `{"request": "function_to_evaluate", "email": "email_address_to_send_result_to"}`
3. Set up a POST API in API Gateway to call the lambda function either through the console
![API Gateway](images/api_gateway_setup.png)<br />
or by importing [swagger+api json](api/swagger+api.json). Make sure you enable CORS as appropriate for the hostname where your human-friendly web form will live, and make sure you deploy the API to prod. Once that's done you can test the API from the command line, e.g.
```shell
curl --data "{\"request\": \"5435*23\", \"email\": \"email_address_to_send_result_to\"}" https://216cvofajl.us-west-2.amazonaws.com/prod/sendBrunsvigaRequest
```
4. Set up an s3 bucket (bucket policy to be world readable for holding [human-friendly web form](index.html) as well as results. Note you can't use s3 static web site hosting as it doesn't support https, either you need to look directly at the object url for index.html or use cloudfront or put it on some other https-enabled service.

## First calculation run
![First request as received by human operator](images/first_request.png "First request as received by human operator")

Video:

[![Video of calculation](https://img.youtube.com/vi/pvgsz3y1V50/0.jpg)](http://www.youtube.com/watch?v=pvgsz3y1V50 "Web accessible Brunsviga 13RK")

## Future ideas
* How to deal with tracking and returning requests (use DynamoDB?).
* Could build a robot to work inputs and turn knob, plus OCR for readout.

## Images
![Brunsviga 13RK](images/Brunsviga13RK.jpg "Brunsviga 13RK")
![me operating my Brunsviga 13RK](images/man_and_machine.jpg "Me and my Brunsviga13RK")
