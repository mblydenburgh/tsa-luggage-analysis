var app = angular.module('myApp',['chart.js']);

app.controller("LineCtrl", function ($scope,$http) {

    /* set up XMLHttpRequest */
    var url = "claims.xls";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e) {
      var arraybuffer = oReq.response;

      /* convert data to binary string */
      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");

      /* Call XLSX */
      var workbook = XLSX.read(bstr, {type:"binary"});

      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      var jsonData = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      $scope.totalEntries = jsonData.length;

      console.log('Parsing ' + jsonData.length + ' entries...');

      // Sample Entry
      console.log(jsonData[878]);

      // Define variables for data
      var airlineNames = [];
      var airportCodes = [];
      var claimTotal = 0;



      // Loop through all json data
      for(i = 0; i < jsonData.length; i++){

        var date = XLSX.SSF.parse_date_code(jsonData[i]["Incident Date"],{date1904:false});
        var airport = String(jsonData[i]["Airport Code"]);
        var airline = String(jsonData[i]["Airline Name"]);
        var claim = Number(jsonData[i]["Close Amount"]);
        claim = claim || 0; // Convert "-" to 0 for summing and average
        claimTotal += claim;

        // console.log(claim);


        if (airlineNames.includes(airline) === false){
          airlineNames.push(airline);
        } else{
            continue;
        }


        if (airportCodes.includes(airport) === false){
          airportCodes.push(airport);
        } else{
            continue;
        }

      }; // End loop through rows

      // List of all airport codes & airline names for sanity check
      airlineNames = airlineNames.sort();
      airportCodes = airportCodes.sort();
      $scope.names = airlineNames;
      console.log(airportCodes);
      console.log(airlineNames);
      console.log("Total Claim Amount: " + claimTotal);
      // Avg. calculation includes "-" entries for claim amount
      var claimAvg = claimTotal / jsonData.length;
      console.log("Average Claim: " + claimAvg);
      $scope.totalClaims = claimTotal.toFixed(2);
      $scope.avgClaim = claimAvg.toFixed(2);


      /* Button 1 click displays line graph */
      $scope.graph1Ctrl = function(){
        $scope.chart_type = "line";
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
          [65, 59, 80, 81, 56, 55, 40],
          [28, 48, 40, 19, 86, 27, 90]
        ];
      }
      /* Button 2 click displays bar graph */
      $scope.graph2Ctrl = function(){
        $scope.chart_type = "bar";
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
          [85, 50, 74, 81, 75, 77, 69],
          [28, 48, 40, 19, 86, 27, 90]
        ];
      }
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right'
            }
          ]
        }
      };


    }

    oReq.send();




});
