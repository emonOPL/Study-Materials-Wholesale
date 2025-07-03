let currentDiscountRate = 0;

$(document).ready(function () {
  // ===== Function to Initialize Datepickers =====
  $("#date-from, #date-to, #sales-date").datepicker({
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
        percentage.addClass("warning-border");
      } else {
        closingInput.val("").prop("disabled", true);
        percentage.removeClass("warning-border");
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

    row.find(".percentage").each(function () {
      $(this).on("change", function () {
        if ($(this).val() > 0) {
          $(this).removeClass("warning-border");
        } else {
          $(this).addClass("warning-border");
        }
      });
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

      if ($("#discountTable tbody tr").length === 1) {
        $("#addDiscount").show();
      }
    });

    $(this).hide();
  });

  // ===== Remove Discount Row (initial rows only) =====
  $(".remove-discount-row").click(function () {
    $(this).closest("tr").remove();
  });

  //   ===== Form Validation and Submission =====

  $("input[name='name']").on("keyup", function () {
    if ($(this).val().trim() !== "") {
      $("#name-group").removeClass("has-error");
      $("#name-group .help-block").addClass("hide");
    } else {
      $("#name-group").addClass("has-error");
      $("#name-group .help-block").removeClass("hide");
    }
  });

  $("input[name='tin']").on("keyup", function () {
    if (
      $(this).val().trim().length === 10 ||
      $(this).val().trim().length === 12
    ) {
      $("#tin-group").removeClass("has-error");
      $("#tin-group .help-block").addClass("hide");
    } else {
      $("#tin-group").addClass("has-error");
      $("#tin-group .help-block").removeClass("hide");
    }
  });

  $("input[name='mobile']").on("keyup", function () {
    if (
      $(this).val().trim().length === 11 ||
      $(this).val().trim().length === 13
    ) {
      $("#mobile-group").removeClass("has-error");
      $("#mobile-group .help-block").addClass("hide");
    } else {
      $("#mobile-group").addClass("has-error");
      $("#mobile-group .help-block").removeClass("hide");
    }
  });

  $("input[name='bin']").on("keyup", function () {
    if ($(this).val().trim().length === 13) {
      $("#bin-group").removeClass("has-error");
      $("#bin-group .help-block").addClass("hide");
    } else {
      $("#bin-group").addClass("has-error");
      $("#bin-group .help-block").removeClass("hide");
    }
  });

  $("input[name='email']").on("keyup", function () {
    if ($(this).val().trim() !== "") {
      $("#email-group").removeClass("has-error");
      $("#email-group .help-block").addClass("hide");
    } else {
      $("#email-group").addClass("has-error");
      $("#email-group .help-block").removeClass("hide");
    }
  });

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

    if (
      name === "" ||
      tin === "" ||
      !isValidTIN(tin) ||
      mobile === "" ||
      !isValidMobile(mobile) ||
      bin === "" ||
      !isValidBIN(bin)
    ) {
      $("#name-group").addClass("has-error");
      $("#name-group .help-block").removeClass("hide");

      $("#tin-group").addClass("has-error");
      $("#tin-group .help-block")
        .text("Enter a valid 10 or 12-digit TIN")
        .removeClass("hide");

      $("#mobile-group").addClass("has-error");
      $("#mobile-group .help-block")
        .text("Please enter a valid mobile number.")
        .removeClass("hide");

      $("#bin-group").addClass("has-error");
      $("#bin-group .help-block")
        .text("Please enter a valid 13-digit BIN.")
        .removeClass("hide");

      return;
    } else if (email !== "" && !isValidEmail(email)) {
      $("#email-group").addClass("has-error");
      $("#email-group .help-block").removeClass("hide");
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

  //   ===== Add Book Page =====

  $("#customer").select2({
    placeholder: "Search Customer",
    allowClear: true,
  });

  $("#customer").on("change", function () {
    const selectedOption = $(this).find("option:selected");
    const discount = selectedOption.data("discount") || 0;
    currentDiscountRate = discount;

    var tableRows = $("#addBookTable tbody tr");
    tableRows.each(function () {
      $(this).find(".regular").val(currentDiscountRate);
      calculateAmount($(this));
    });

    calculateTotal();
  });

  function calculateTotal() {
    var totalAmount = 0;
    var grandTotalAmount = 0;
    var specialAmount = 0;

    $("#addBookTable tbody tr").each(function () {
      const calculateAmount = parseFloat($(this).find(".amount").val()) || 0;
      const calculateSpecialAmount =
        parseFloat($(this).find(".special").val()) || 0;
      const calculateGrandAmount =
        parseFloat($(this).find(".net-amount").val()) || 0;
      totalAmount += calculateAmount;
      grandTotalAmount += calculateGrandAmount;
      specialAmount += calculateSpecialAmount;
    });

    $("#total-amount").val(totalAmount.toFixed(2));
    $("#regular-discount").val(
      (totalAmount * (currentDiscountRate / 100)).toFixed(2)
    );
    $("#special-discount").val(specialAmount.toFixed(2));
    $("#grand-total").val(grandTotalAmount.toFixed(2));
  }

  function calculateAmount(row) {
    const rate = parseInt(row.find(".rate").val());
    const quantity = parseInt(row.find(".quantity").val());
    const amount = rate * quantity;
    const regular = parseInt(row.find(".regular").val());
    const special = parseInt(row.find(".special").val()) || 0;
    const netAmount = amount - amount * (regular / 100) - special;

    row.find(".amount").val(amount);
    row.find(".net-amount").val(netAmount);

    calculateTotal();
  }

  const materialArray = [];

  // ===== Add Discount Row =====

  function checkAvailability(selectedRow, selectedName, selectedValue) {
    var tableRows = $("#addBookTable tbody tr").not(selectedRow);
    var found = false;

    tableRows.each(function () {
      const currentValue = $(this).find(`select[name='${selectedName}']`).val();
      if (currentValue && currentValue == selectedValue) {
        found = true;
        return false;
      }
    });

    return !found;
  }

  $("#addMaterials").click(function () {
    var lastRow = $("#addBookTable tbody tr:last");
    var newRow = lastRow.clone().removeClass("hide");
    var newId = parseInt(lastRow.data("id")) + 1;
    var selectedMaterial = newRow.find("select[name='material']");
    var selectedProgram = newRow.find("select[name='program']");
    var selectedSession = newRow.find("select[name='session']");
    var selectedMaterials = newRow.find("select[name='materials']");

    newRow.attr("data-id", newId);
    newRow.find(".rate").val(0);
    newRow.find(".quantity").val(0);
    newRow.find(".special").val(0);
    newRow.find(".quantity").removeClass("warning-border");
    newRow.find(".material-td").removeClass("has-error");
    newRow.find(".help-block").addClass("hide");

    $("#addBookTable tbody").append(newRow);

    calculateAmount(newRow);

    newRow.find(".special").on("keyup", function () {
      calculateAmount(newRow);
    });

    newRow.find(".quantity").on("change", function () {
      calculateAmount(newRow);
    });

    selectedMaterial.on("change", function () {
      var value = $(this).val();

      const selectedOption = $(this).find("option:selected");
      const price = selectedOption.data("price") || 0;
      const quantity = $(this).closest("tr").find(".quantity").val();
      $(this).closest("tr").find(".rate").val(price);

      if (value !== "" && quantity <= 0) {
        $(this).closest("tr").find(".quantity").addClass("warning-border");
      }

      const checkMaterial = checkAvailability(
        newRow,
        "material",
        $(this).val()
      );
      const checkProgram = checkAvailability(
        newRow,
        "program",
        selectedProgram.val()
      );
      const checkSession = checkAvailability(
        newRow,
        "session",
        selectedSession.val()
      );
      const checkMaterials = checkAvailability(
        newRow,
        "materials",
        selectedMaterials.val()
      );

      if (!checkMaterial && !checkProgram && !checkSession && !checkMaterials) {
        $(this).closest("td").addClass("has-error");
        $(this).closest("td").find(".help-block").removeClass("hide");
      } else {
        $(this).closest("td").removeClass("has-error");
        $(this).closest("td").find(".help-block").addClass("hide");
      }
    });

    selectedMaterials.on("change", function () {
      const checkMaterial = checkAvailability(
        newRow,
        "material",
        selectedMaterial.val()
      );
      const checkProgram = checkAvailability(
        newRow,
        "program",
        selectedProgram.val()
      );
      const checkSession = checkAvailability(
        newRow,
        "session",
        selectedSession.val()
      );
      const checkMaterials = checkAvailability(
        newRow,
        "materials",
        $(this).val()
      );

      if (!checkMaterial && !checkProgram && !checkSession && !checkMaterials) {
        $(this).closest("tr").find(".material-td").addClass("has-error");
        $(this).closest("tr").find(".help-block").removeClass("hide");
      } else {
        $(this).closest("tr").find(".material-td").removeClass("has-error");
        $(this).closest("tr").find(".help-block").addClass("hide");
      }
    });

    selectedSession.on("change", function () {
      const checkMaterial = checkAvailability(
        newRow,
        "material",
        selectedMaterial.val()
      );
      const checkProgram = checkAvailability(
        newRow,
        "program",
        selectedProgram.val()
      );
      const checkSession = checkAvailability(newRow, "session", $(this).val());
      const checkMaterials = checkAvailability(
        newRow,
        "materials",
        selectedMaterials.val()
      );

      if (!checkMaterial && !checkProgram && !checkSession && !checkMaterials) {
        $(this).closest("tr").find(".material-td").addClass("has-error");
        $(this).closest("tr").find(".help-block").removeClass("hide");
      } else {
        $(this).closest("tr").find(".material-td").removeClass("has-error");
        $(this).closest("tr").find(".help-block").addClass("hide");
      }
    });

    selectedProgram.on("change", function () {
      const checkMaterial = checkAvailability(
        newRow,
        "material",
        selectedMaterial.val()
      );
      const checkProgram = checkAvailability(newRow, "program", $(this).val());
      const checkSession = checkAvailability(
        newRow,
        "session",
        selectedSession.val()
      );
      const checkMaterials = checkAvailability(
        newRow,
        "materials",
        selectedMaterials.val()
      );

      if (!checkMaterial && !checkProgram && !checkSession && !checkMaterials) {
        $(this).closest("tr").find(".material-td").addClass("has-error");
        $(this).closest("tr").find(".help-block").removeClass("hide");
      } else {
        $(this).closest("tr").find(".material-td").removeClass("has-error");
        $(this).closest("tr").find(".help-block").addClass("hide");
      }
    });

    newRow.find(".quantity").on("change", function () {
      if ($(this).val() > 0) {
        $(this).removeClass("warning-border");
      } else {
        $(this).addClass("warning-border");
      }
    });

    // Re-bind remove handler
    newRow.find(".remove-material-row").click(function () {
      $(this).closest("tr").remove();
    });
  });

  // ===== Remove Discount Row (initial rows only) =====
  $(".remove-material-row").click(function () {
    $(this).closest("tr").remove();
  });

  $("#addBookForm").submit(function (event) {
    event.preventDefault();

    const customer = $(this).find("select[name='customer']").val().trim();
    const organization = $(this)
      .find("select[name='organization']")
      .val()
      .trim();
    const session = $(this).find("select[name='session']").val().trim();
    const program = $(this).find("select[name='program']").val().trim();
    const materials = $(this).find("select[name='materials']").val().trim();
    const challan = $(this).find("input[name='challan-no']").val().trim();

    if (
      !customer ||
      !organization ||
      !session ||
      !program ||
      !materials ||
      !challan
    ) {
      $("#customer-group").addClass("has-error");
      $("#customer-group").find(".help-block").removeClass("hide");

      $("#organization-group").addClass("has-error");
      $("#organization-group").find(".help-block").removeClass("hide");

      $("#session-group").addClass("has-error");
      $("#session-group").find(".help-block").removeClass("hide");

      $("#program-group").addClass("has-error");
      $("#program-group").find(".help-block").removeClass("hide");

      $("#materials-group").addClass("has-error");
      $("#materials-group").find(".help-block").removeClass("hide");

      $("#challan-no-group").addClass("has-error");
      $("#challan-no-group").find(".help-block").removeClass("hide");

      return;
    }

    window.location.href = "print.html";

    alert("Form submitted!");
  });

  $("#customer").on("change", function () {
    if (!$(this).val().trim()) {
      $("#customer-group").addClass("has-error");
      $("#customer-group").find(".help-block").removeClass("hide");
    } else {
      $("#customer-group").removeClass("has-error");
      $("#customer-group").find(".help-block").addClass("hide");
    }
  });

  $("#organization").on("change", function () {
    if (!$(this).val().trim()) {
      $("#organization-group").addClass("has-error");
      $("#organization-group").find(".help-block").removeClass("hide");
    } else {
      $("#organization-group").removeClass("has-error");
      $("#organization-group").find(".help-block").addClass("hide");
    }
  });

  $("#session").on("change", function () {
    if (!$(this).val().trim()) {
      $("#session-group").addClass("has-error");
      $("#session-group").find(".help-block").removeClass("hide");
    } else {
      $("#session-group").removeClass("has-error");
      $("#session-group").find(".help-block").addClass("hide");
    }
  });

  $("#program").on("change", function () {
    if (!$(this).val().trim()) {
      $("#program-group").addClass("has-error");
      $("#program-group").find(".help-block").removeClass("hide");
    } else {
      $("#program-group").removeClass("has-error");
      $("#program-group").find(".help-block").addClass("hide");
    }
  });

  $("#materials").on("change", function () {
    if (!$(this).val().trim()) {
      $("#materials-group").addClass("has-error");
      $("#materials-group").find(".help-block").removeClass("hide");
    } else {
      $("#materials-group").removeClass("has-error");
      $("#materials-group").find(".help-block").addClass("hide");
    }
  });

  $("#challan-no").on("keyup", function () {
    if (!$(this).val().trim()) {
      $("#challan-no-group").addClass("has-error");
      $("#challan-no-group").find(".help-block").removeClass("hide");
    } else {
      $("#challan-no-group").removeClass("has-error");
      $("#challan-no-group").find(".help-block").addClass("hide");
    }
  });

  // ----- End Add Book Page -----
});
