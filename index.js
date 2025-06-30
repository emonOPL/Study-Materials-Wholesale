$(document).ready(function () {
  // ===== Function to Initialize Datepickers =====
  function initializeDatepickers(row) {
    row.find(".effective-date, .closing-date").datepicker({
      todayBtn: "linked",
      clearBtn: true,
      autoclose: true,
      todayHighlight: true,
      toggleActive: true,
      format: "dd-mm-yyyy",
    });

    row.find(".closing-date").prop("disabled", true);

    row.find(".effective-date").on("changeDate", function () {
      const value = $(this).val().trim();
      const closingInput = $(this).closest("tr").find(".closing-date");

      if (value !== "") {
        closingInput.prop("disabled", false);
      } else {
        closingInput.val("").prop("disabled", true);
      }
    });

    row.find(".closing-date").on("changeDate", function () {
      const value = $(this).val().trim();

      if (value !== "") {
        $("#addDiscount").show();
      } else {
        $("#addDiscount").hide();
      }
    });
  }

  // ===== Initialize existing rows =====
  $("#discountTable tbody tr").each(function () {
    initializeDatepickers($(this));
  });

  // ===== Add Discount Row =====
  $("#addDiscount").click(function () {
    var lastRow = $("#discountTable tbody tr:last");
    var newRow = lastRow.clone().removeClass("hide");
    var newId = parseInt(lastRow.data("id")) + 1;

    newRow.attr("data-id", newId);
    newRow.find("td:first").text(newId);
    newRow.find("input").val("");

    $("#discountTable tbody").append(newRow);

    initializeDatepickers(newRow); // ← apply datepicker + binding

    // Re-bind remove handler
    newRow.find(".remove-discount-row").click(function () {
      $(this).closest("tr").remove();
    });

    $(this).hide();
  });

  // ===== Remove Discount Row (initial rows only) =====
  $(".remove-discount-row").click(function () {
    $(this).closest("tr").remove();
  });
});
