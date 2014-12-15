Conveyor-Pattern
================

This design pattern is created to cater the requirement where processes/steps are supposed to be 
executed in an order - just like product moving on a conveyor belt and different departments 
execute their part as and when the product reaches to corresponding department. There may be some steps
at one particular point which are independent of on another - see processOrder array.

This also takes care of accidental multiple calls to a step. Only first registered call be executed and 
rest all will be ignored.

Refer the following flowchart to easily understand the pattern.

https://raw.githubusercontent.com/SunilSyal/Conveyor-Pattern/master/CP.jpg
