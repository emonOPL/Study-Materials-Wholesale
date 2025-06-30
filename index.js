$(document).ready(function () {
  // ===== Function to Initialize Datepickers =====
  $("#date-from, #date-to").datepicker({
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    format: "yyyy-mm-dd",
  });

  function initializeDatepickers(row) {
    row.find(".effective-date, .closing-date").datepicker({
      todayBtn: "linked",
      clearBtn: true,
      autoclose: true,
      todayHighlight: true,
      toggleActive: true,
      format: "yyyy-mm-dd",
    });

    row.find(".closing-date").prop("disabled", true);

    row.find(".effective-date").on("changeDate", function () {
      const value = $(this).val().trim();
      const closingInput = $(this).closest("tr").find(".closing-date");
      const percentage = $(this).closest("tr").find(".percentage");

      if (value !== "") {
        closingInput.prop("disabled", false);
        percentage.attr("required", true);
        percentage
          .closest("td")
          .append(
            `<span class="help-block hide">Percentage field is required.</span>`
          );
      } else {
        closingInput.val("").prop("disabled", true);
        percentage.attr("required", false);
        percentage.closest("td").find(".help-block").remove();
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

  //   ===== Form Validation and Submission =====

  $("#addCustomerForm").submit(function (event) {
    event.preventDefault();

    const customer = {};
    const discounts = [];

    function isValidTIN(tin) {
      // Must be all digits and length 10 or 12
      return /^\d{10}$/.test(tin) || /^\d{12}$/.test(tin);
    }
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function isValidMobile(number) {
      number = number.trim();
      // Remove + if it starts with +880
      if (number.startsWith("+")) {
        number = number.replace("+", "");
      }
      // Allow 01XXXXXXXXX, 8801XXXXXXXXX
      const regex = /^(?:8801|01)[3-9]\d{8}$/;
      return regex.test(number);
    }
    function isValidBIN(bin) {
      return /^\d{13}$/.test(bin);
    }

    var name = $(this).find("input[name='name']").val().trim();
    var tin = $(this).find("input[name='tin']").val().trim();
    var mobile = $(this).find("input[name='mobile']").val().trim();
    var bin = $(this).find("input[name='bin']").val().trim();
    var email = $(this).find("input[name='email']").val().trim();
    var status = $(this).find("select[name='status']").val();
    var address = $(this).find("textarea[name='address']").val().trim();

    $(".has-error").each(function () {
      $(this).removeClass("has-error");
    });
    $(".help-block").each(function () {
      $(this).addClass("hide");
    });

    if (name === "") {
      $("#name-group").addClass("has-error");
      $("#name-group .help-block").removeClass("hide");
      return;
    } else if (tin === "") {
      $("#tin-group").addClass("has-error");
      $("#tin-group .help-block").removeClass("hide");
      return;
    } else if (!isValidTIN(tin)) {
      $("#tin-group").addClass("has-error");
      $("#tin-group .help-block")
        .text("Enter a valid 10 or 12-digit TIN")
        .removeClass("hide");
      return;
    } else if (email !== "" && !isValidEmail(email)) {
      $("#email-group").addClass("has-error");
      $("#email-group .help-block").removeClass("hide");
      return;
    } else if (mobile === "") {
      $("#mobile-group").addClass("has-error");
      $("#mobile-group .help-block").removeClass("hide");
      return;
    } else if (!isValidMobile(mobile)) {
      $("#mobile-group").addClass("has-error");
      $("#mobile-group .help-block")
        .text("Please enter a valid mobile number.")
        .removeClass("hide");
      return;
    } else if (bin === "") {
      $("#bin-group").addClass("has-error");
      $("#bin-group .help-block").removeClass("hide");
      return;
    } else if (!isValidBIN(bin)) {
      $("#bin-group").addClass("has-error");
      $("#bin-group .help-block")
        .text("Please enter a valid 13-digit BIN.")
        .removeClass("hide");
      return;
    }

    $("#discountTable tbody tr")
      .not(".hide")
      .each(function () {
        const row = $(this);
        const dataId = row.data("id");

        const effectiveDate = row.find(".effective-date").val().trim();
        const closingDate = row.find(".closing-date").val().trim();
        const percentage = row.find(".percentage").val().trim();

        if (effectiveDate !== "" && percentage === "") {
          row.find(".percentage").closest("td").addClass("has-error");
          row
            .find(".percentage")
            .closest("td")
            .find(".help-block")
            .removeClass("hide");
          return;
        }

        if (effectiveDate || closingDate || percentage) {
          discounts.push({
            id: dataId,
            effective_date: effectiveDate,
            closing_date: closingDate,
            percentage: percentage,
          });
        }
      });

    alert("Form submitted successfully!");
  });
});
