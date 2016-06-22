# brunsviga
Code for an api for a mechanical computer (Brunsviga 13RK). Wrapper around a human (or possibly robot) in the loop.

## Plan
Just a plan at this stage:
* Use AWS gateway service to provide a REST API.
* Trigger an AWS lambda function that checks input is sane (e.g. numbers can't be more than ten decimal digits long) and sends JSON via AWS SNS of operation to be run by a human.
* Wait for user operator to call REST API to return results.
* Original requester must poll API for ready status, and then GET result.

Thoughts:
* How to deal with tracking and returning requests (DynamoDB?).
* Could build a robot to work inputs and turn knob, plus OCR for readout.
