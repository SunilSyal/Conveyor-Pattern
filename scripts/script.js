/////////////////////////////////////////////////////////////
// JavaScript Document
// Conveyor Pattern - Javascript design pattern
// Created by : © Sunil Syal
// License : Conveyor Pattern (Javascript design pattern) by Sunil Syal is licensed under a 
// Creative Commons Attribution 4.0 International License.
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// Description
/*
This design pattern is created to cater the requirement where processes/steps are supposed to be 
executed in an order - just like product moving on a conveyor belt and different departments 
execute their part as and when the product reaches to corresponding department. There may be some steps
at one particular point which are independent of on another - see processOrder array.

This also takes care of accidental multiple calls to a step. Only first registered call be executed and 
rest all will be ignored.
*/
var CP = CP || (function() {
  var PROCESS = {}, 
  // Define process order here.
  processOrder = [
    "step_1",
    "step_2",                 // Step 2 will execute on when Step 1 is over
    ["step_3", "step_4"],     // Steps 3, 4 are independent of each other but will execute only when Step 2 is over
    ["step_5", "step_6"],     // Steps 5, 6 are independent of each other but will execute only when Steps 3, 4 are over
    "step_7"                  // Step 7 will execute on when Steps 5, 6 are over
  ],
    currentPosition = 0,
    quickRefObjArr = [],
    processLen;

/* Function fnGenQuickRefrence configures quickRefObjArr object which is used for status tracking
and reverse indexing. */
  function fnGenQuickRefrence() {
    var i, j, sublen, objName;
    processLen = processOrder.length;

    for (i = 0; i < processLen; i++) {

      if (typeof processOrder[i] !== "string") {
        sublen = processOrder[i].length;

        /*Multi-step process is handled here. In this example, Step 3 and Step 4 are part of one process
        and should share the same reverse index. */
        
        for (j = 0; j < sublen; j++) {
          objName = processOrder[i][j]
          quickRefObjArr[objName] = {};
          quickRefObjArr[objName].index = i;
          quickRefObjArr[objName].status = "red";   // Initial state of a step
          quickRefObjArr[objName].myArgs = [];
          quickRefObjArr[i] = quickRefObjArr[i] ? quickRefObjArr[i] + 1 : 1;
        }
      } else {
        
        // Single step process
        
        objName = processOrder[i];
        quickRefObjArr[objName] = {};
        quickRefObjArr[objName].index = i;
        quickRefObjArr[objName].status = "red";
        quickRefObjArr[i] = 1;
      }
    }
  }
  fnGenQuickRefrence();

  trace("Process length is: "+ processLen +"<br>")
  
  // Define the steps here.

  PROCESS.step_1 = function() {
    trace('Step 1 Complete');
  }

  PROCESS.step_2 = function() {
    trace('Step 2 Complete');
  }

  PROCESS.step_3 = function() {
    trace('Step 3 Complete');
  }

  PROCESS.step_4 = function(a, b) {
    trace('Step 4 Complete:: a = ' + a + " :: b = " + b);
  }

  PROCESS.step_5 = function() {
    trace('Step 5 Complete');
  }

  PROCESS.step_6 = function() {
    trace('Step 6 Complete');
  }

  PROCESS.step_7 = function() {
    trace('Step 7 Complete');
  }

  /* Function fnRunOrWait accepts the name of the step and arguments. 
  It executes the step if dependent steps are processed*/ 

  function fnRunOrWait(stepName, args) {
    var myIndex = quickRefObjArr[stepName].index,
      prevStepState = quickRefObjArr[myIndex - 1],
      bool = fnMarkReady(stepName, args);
    if (bool && (myIndex == 0 || (prevStepState == 0 && myIndex > 0))) {
      fnExecute(stepName)
    }
    fnCheckProcessCompletion()
  }

/* Function fnMarkReady marks a step ready for execution and saves its arguments, if any*/ 

  function fnMarkReady(stepName, args) {
    var fnState = quickRefObjArr[stepName].status;
    if (fnState == "green" || fnState == "yellow") {
      return false;
    }
    quickRefObjArr[stepName].status = "yellow";
    quickRefObjArr[stepName].myArgs = args;
    trace(stepName + "::" + quickRefObjArr[stepName].status)
    return true;
  }

/* Function fnExecute executes a step and informs the next step*/ 
  function fnExecute(stepName) {
    var myIndex = quickRefObjArr[stepName].index,
      myArgs = quickRefObjArr[stepName].myArgs;
    PROCESS[stepName].apply(PROCESS, myArgs);
    quickRefObjArr[myIndex]--;
    quickRefObjArr[stepName].status = "green";
    fnProceedToNextReady(myIndex)
  }

/* Function fnProceedToNextReady checks if a step is good to execute*/ 
  function fnProceedToNextReady(myIndex) {
    var nextIndex = myIndex + 1;
    if (quickRefObjArr[myIndex] == 0 && nextIndex < processLen) {
      if (typeof processOrder[nextIndex] !== "string") {
        sublen = processOrder[nextIndex].length;
        for (j = 0; j < sublen; j++) {
          objName = processOrder[nextIndex][j];
          if (quickRefObjArr[objName].status == "yellow") {
            fnExecute(objName);
          }
        }
      } else {
        objName = processOrder[nextIndex];
        if (quickRefObjArr[objName].status == "yellow") {
          fnExecute(objName);
        }
      }
    }
  }

/* Function fnCheckProcessCompletion checks if the entire process if complete*/ 
  function fnCheckProcessCompletion() {
    if (quickRefObjArr[processLen - 1] == 0) {
      trace("All Done");
    }
  }
  return {
    build: fnRunOrWait
  };
}());

// Test the pattern here */
CP.build("step_2");
CP.build("step_7");
CP.build("step_6");
CP.build("step_5");
CP.build("step_4", [12, 134]);
CP.build("step_4", [124444, 134444]); // Another attempt to execute a step will be ignored.
CP.build("step_1");
CP.build("step_7");
CP.build("step_6");
CP.build("step_5");
CP.build("step_2");
CP.build("step_1");
CP.build("step_3");

function trace(str) {
  document.getElementById("output").innerHTML += "<br>" + str;
}