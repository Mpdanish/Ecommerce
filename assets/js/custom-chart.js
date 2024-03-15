(function ($) {
    "use strict";
  
    /*Sale statistics Chart*/
    if ($("#myChart").length) {
      var ctx = document.getElementById("myChart").getContext("2d");
  
      let Muser1 = document.getElementById("Muser1").value;
      let Muser2 = document.getElementById("Muser2").value;
      let Muser3 = document.getElementById("Muser3").value;
      let Muser4 = document.getElementById("Muser4").value;
      let Muser5 = document.getElementById("Muser5").value;
      let Muser6 = document.getElementById("Muser6").value;
      let Muser7 = document.getElementById("Muser7").value;
      let Muser8 = document.getElementById("Muser8").value;
      let Muser9 = document.getElementById("Muser9").value;
      let Muser10 = document.getElementById("Muser10").value;
      let Muser11 = document.getElementById("Muser11").value;
      let Muser12 = document.getElementById("Muser12").value;
  
      let Msales1 = document.getElementById("Msales1").value;
      let Msales2 = document.getElementById("Msales2").value;
      let Msales3 = document.getElementById("Msales3").value;
      let Msales4 = document.getElementById("Msales4").value;
      let Msales5 = document.getElementById("Msales5").value;
      let Msales6 = document.getElementById("Msales6").value;
      let Msales7 = document.getElementById("Msales7").value;
      let Msales8 = document.getElementById("Msales8").value;
      let Msales9 = document.getElementById("Msales9").value;
      let Msales10 = document.getElementById("Msales10").value;
      let Msales11 = document.getElementById("Msales11").value;
      let Msales12 = document.getElementById("Msales12").value;
  
      let MOrder1 = document.getElementById("MOrder1").value;
      let MOrder2 = document.getElementById("MOrder2").value;
      let MOrder3 = document.getElementById("MOrder3").value;
      let MOrder4 = document.getElementById("MOrder4").value;
      let MOrder5 = document.getElementById("MOrder5").value;
      let MOrder6 = document.getElementById("MOrder6").value;
      let MOrder7 = document.getElementById("MOrder7").value;
      let MOrder8 = document.getElementById("MOrder8").value;
      let MOrder9 = document.getElementById("MOrder9").value;
      let MOrder10 = document.getElementById("MOrder10").value;
      let MOrder11 = document.getElementById("MOrder1").value;
      let MOrder12 = document.getElementById("MOrder1").value;
  
      let jan = document.getElementById("jan").value;
      let feb = document.getElementById("feb").value;
      let mar = document.getElementById("mar").value;
      let apr = document.getElementById("apr").value;
      let may = document.getElementById("may").value;
      let jun = document.getElementById("jun").value;
      let jul = document.getElementById("jul").value;
      let aug = document.getElementById("aug").value;
      let sep = document.getElementById("sep").value;
      let oct = document.getElementById("oct").value;
      let nov = document.getElementById("nov").value;
      let dec = document.getElementById("dec").value;
  
      let Jan = document.getElementById("Jan").value;
      let Feb = document.getElementById("Feb").value;
      let Mar = document.getElementById("Mar").value;
      let Apr = document.getElementById("Apr").value;
      let May = document.getElementById("May").value;
      let Jun = document.getElementById("Jun").value;
      let Jul = document.getElementById("Jul").value;
      let Aug = document.getElementById("Aug").value;
      let Sep = document.getElementById("Sep").value;
      let Oct = document.getElementById("Oct").value;
      let Nov = document.getElementById("Nov").value;
      let Dec = document.getElementById("Dec").value;
  
      let JanOrders = document.getElementById("JAN").value;
      let FebOrders = document.getElementById("FEB").value;
      let MarOrders = document.getElementById("MAR").value;
      let AprOrders = document.getElementById("APR").value;
      let MayOrders = document.getElementById("MAY").value;
      let JunOrders = document.getElementById("JUN").value;
      let JulOrders = document.getElementById("JUL").value;
      let AugOrders = document.getElementById("AUG").value;
      let SepOrders = document.getElementById("SEP").value;
      let OctOrders = document.getElementById("OCT").value;
      let NovOrders = document.getElementById("NOV").value;
      let DecOrders = document.getElementById("DEC").value;
  
      let year2018 = document.getElementById("2018").value;
      let year2019 = document.getElementById("2019").value;
      let year2020 = document.getElementById("2020").value;
      let year2021 = document.getElementById("2021").value;
      let year2022 = document.getElementById("2022").value;
      let year2023 = document.getElementById("2023").value;
      let year2024 = document.getElementById("2024").value;
  
      let order2018 = document.getElementById("order2018").value;
      let order2019 = document.getElementById("order2019").value;
      let order2020 = document.getElementById("order2020").value;
      let order2021 = document.getElementById("order2021").value;
      let order2022 = document.getElementById("order2022").value;
      let order2023 = document.getElementById("order2023").value;
      let order2024 = document.getElementById("order2024").value;
      console.log(order2024, "daa");
  
      let users2018 = document.getElementById("users2018").value;
      let users2019 = document.getElementById("users2019").value;
      let users2020 = document.getElementById("users2020").value;
      let users2021 = document.getElementById("users2021").value;
      let users2022 = document.getElementById("users2022").value;
      let users2023 = document.getElementById("users2023").value;
      let users2024 = document.getElementById("users2024").value;
  
      var chart1 = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",
  
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Sales",
              tension: 0.3,
              fill: true,
              backgroundColor: "rgba(44, 120, 220, 0.2)",
              borderColor: "rgba(44, 120, 220)",
              data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec],
            },
            {
              label: "Users",
              tension: 0.3,
              fill: true,
              backgroundColor: "rgba(4, 209, 130, 0.2)",
              borderColor: "rgb(4, 209, 130)",
              data: [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec],
            },
            {
              label: "Orders",
              tension: 0.3,
              fill: true,
              backgroundColor: "rgba(380, 200, 230, 0.2)",
              borderColor: "rgb(380, 200, 230)",
              data: [
                JanOrders,
                FebOrders,
                MarOrders,
                AprOrders,
                MayOrders,
                JunOrders,
                JulOrders,
                AugOrders,
                SepOrders,
                OctOrders,
                NovOrders,
                DecOrders,
              ],
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
              },
            },
          },
        },
      });
  
      var monthlyData = [
        Msales1,
        Msales2,
        Msales3,
        Msales4,
        Msales5,
        Msales6,
        Msales7,
        Msales8,
        Msales9,
        Msales10,
        Msales11,
        Msales12,
      ];
      var yearlyData = [
        year2018,
        year2019,
        year2020,
        year2021,
        year2022,
        year2023,
        year2024,
      ];
  
      var monthlyUserData = [
        Muser1,
        Muser2,
        Muser3,
        Muser4,
        Muser5,
        Muser6,
        Muser7,
        Muser8,
        Muser9,
        Muser10,
        Muser11,
        Muser12,
      ];
      var yearlyUserData = [
        users2018,
        users2019,
        users2020,
        users2021,
        users2022,
        users2023,
        users2024,
      ];
  
      var monthlyOrderData = [
        MOrder1,
        MOrder2,
        MOrder3,
        MOrder4,
        MOrder5,
        MOrder6,
        MOrder7,
        MOrder8,
        MOrder9,
        MOrder10,
        MOrder11,
        MOrder12,
      ];
      var yearlyOrderData = [
        order2018,
        order2019,
        order2020,
        order2021,
        order2022,
        order2023,
        order2024,
      ];
      // Click event for elements with the class "toggle-chart"
      $(".toggle-chart").on("click", function () {
        console.log("nweiufwbfeiub");
        var chartType = $(this).data("chart-type");
        var labels1 =
          chartType === "monthly"
            ? [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ]
            : Array.from({ length: 2024 - 2018 + 1 }, (_, i) =>
                (2018 + i).toString()
              );
  
        // Update data based on chart type
        var newData = chartType === "monthly" ? monthlyData : yearlyData;
  
        var newUsersData =
          chartType === "monthly" ? monthlyUserData : yearlyUserData;
        var newOrderData =
          chartType === "monthly" ? monthlyOrderData : yearlyOrderData;
        // Update dataset values for both Sales and Orders
        chart1.data.datasets[2].data = newOrderData; // Sales data
        chart1.data.datasets[0].data = newData; // Orders data
        chart1.data.datasets[1].data = newUsersData; // Orders data
  
        // Update labels for the dataset
        chart1.data.labels = labels1;
  
        // Update the chart
        chart1.update();
      });
    } //End if
  
    /*Sale statistics Chart*/
    // if ($("#myChart2").length) {
    //   var ctx = document.getElementById("myChart2");
  
    // } //end if
  })(jQuery);
  