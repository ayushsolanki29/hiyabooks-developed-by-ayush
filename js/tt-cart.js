window.onload = function () {
  var curCost = 0;
  var curName = 0;
  var cartItems = [];
  var cindex = 0;
  var fx = 0,
    fy = 0;
  var tx = 0,
    ty = 0;
  var curItem = "";
  var item_list = document.querySelectorAll(".add-item");
  $delivery = $("input[name=delivery]:checked").val();
  var delivery = Number($delivery);
  document.getElementById("cost_delivery").innerHTML = delivery.toFixed(2);
  for (var i = 0; i < item_list.length; i++) {
    item_list[i].addEventListener("click", function (ev) {
      curCost = this.getAttribute("data-cost");
      curName = this.getAttribute("data-name");
      curImage = this.getAttribute("data-image");
      var id = this.getAttribute("data-id");
      var x = $(this).position();
      fx = (window.innerWidth - 982) / 2 + 160 * (id - 1);
      (function () {
        mover_animator(fx, fy, tx, ty);
      })(
        setTimeout(function () {
          addItem(id, curCost, curName, curImage);
        }, 350)
      );
    });
  }
  $(document).on("click", ".cart-item-remove", function () {
    curCost = $(this).parent(".cart-item").find(".cvalue").text();
    removeCost(curCost);
    //this.parentNode.remove(); // ie fix
    this.parentNode.outerHTML = "";
    //$( "#items-counter" ).empty();
    toggleEptyCart();
    curCounter = $("#items .cart-item").length;
    $("#items-counter").empty();
    document.getElementById("items-counter").innerHTML +=
      "<span class='animate'>" +
      curCounter +
      "<span class='circle'></span></span>";
  });

  function addItem(id, cost) {
    cindex++;
    cartItems[cindex] = cost;
    $("#items-counter").empty();
    curCounter = $("#items .cart-item").length + 1;
    document.getElementById("items").innerHTML +=
      "<div class='cart-item hidden' id='item" +
      cindex +
      "' data-id='" +
      id +
      "'><span class='cart-item-image'><img alt='" +
      curName +
      "' src='" +
      curImage +
      "'/></span><span class='cart-item-name h4'>" +
      curName +
      "</span><span class='cart-item-price'>₹<span class='cvalue'>" +
      cost +
      "</span></span> <span class='cart-item-remove'><span class='ti-close'></span><span></div>";
    document.getElementById("items-counter").innerHTML +=
      "<span class='animate'>" +
      curCounter +
      "<span class='circle'></span></span>";
    document.getElementById("item" + cindex).classList.remove("hidden");
    toggleEptyCart();
  }

  function addCost(amount) {
    $delivery = $("input[name=delivery]:checked").val();
    var delivery = Number($delivery);
    var oldcost = document.getElementById("cost_value").innerHTML;
    oldcost = parseFloat(oldcost);
    amount = parseFloat(amount);
    var newcost = oldcost + amount;
    var total = oldcost + amount;
    document.getElementById("cost_value").innerHTML = newcost.toFixed(2);
    var carttotal = total + delivery;
    document.getElementById("total-total").innerHTML = carttotal.toFixed(2);
    $("#amount").val(carttotal.toFixed(2));
  }

  function loadItems() {}

  function removeItem() {}

  function removeCost(amount) {
    $delivery = $("input[name=delivery]:checked").val();
    var delivery = Number($delivery);
    var oldcost = document.getElementById("cost_value").innerHTML;
    oldcost = parseFloat(oldcost);
    amount = parseFloat(amount);
    var newcost = oldcost - amount;
    if (newcost == "NaN") {
      newcost = 0.0;
    }
    var total = oldcost - amount;
    if (total == "NaN") {
      total = 0.0;
    }
    var carttotal = total + delivery;
    document.getElementById("total-total").innerHTML = carttotal.toFixed(2);
    document.getElementById("cost_value").innerHTML = newcost.toFixed(2);
    document.getElementById("cost_delivery").innerHTML = delivery.toFixed(2);
    $("#amount").val(carttotal.toFixed(2));
  }

  function mover_animator(x1, y1, x2, y2) {
    var div = document.createElement("div");
    div.className = "mover_animator " + cindex;
    div.style.display = "none";
    document.body.appendChild(div);
    $(div)
      .css({
        left: x1 + "px",
        bottom: y1 + "px",
        top: "auto",
        right: "auto",
      })
      .fadeIn(10)
      .animate(
        {
          right: "auto",
          top: "auto",
          left: window.innerWidth - 200 + "px",
          bottom: window.innerHeight - 240 + "px",
        },
        300,
        function () {
          addCost(curCost);
        }
      );
    setTimeout(function () {
      $(div).remove();
      toggleEptyCart();
    }, 200);
  }

  function updateNumber() {
    var nums = document.querySelectorAll(".cart-item");
    var len = nums.length;
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        nums[i].querySelector(".cart-item-name h3").innerHTML =
          "Item " + (i + 1) + " ---";
      }
    }
  }

  function toggleEptyCart() {
    if (document.querySelectorAll(".cart-item").length >= 1) {
      document.getElementById("cart-summary").style.display = "block";
      document.getElementById("cart-delivery").style.display = "block";
      document.getElementById("cart-form").style.display = "block";
      document.getElementById("cart-empty").style.display = "none";
      document.getElementById("items-counter").style.display = "block";
    } else {
      document.getElementById("cart-summary").style.display = "none";
      document.getElementById("cart-delivery").style.display = "none";
      document.getElementById("cart-form").style.display = "none";
      document.getElementById("cart-empty").style.display = "block";
      document.getElementById("items-counter").style.display = "none";
    }
  }
  var carttotal = 0;

  $("input[type='radio']").change(function () {
    $("#final_summary").show();
    $delivery = $(this).val();
    $total = document.getElementById("cost_value").innerHTML;
    var total = Number($total);
    var delivery = Number($delivery);
    carttotal = total + delivery; // Update the value of carttotal

    document.getElementById("total-total").innerHTML = carttotal.toFixed(2);
    $("#amount").val(carttotal.toFixed(2));
    document.getElementById("cost_delivery").innerHTML = delivery.toFixed(2);
    generateQRCode(carttotal);
  });

  function generateQRCode(carttotal) {
    var upiLink = `upi://pay?pa=ayushsolanki2901@oksbi&pn=AyushSolanki&am=${carttotal.toFixed(
      2
    )}&cu=INR&aid=uGICAgICP69GhAg`;
    $("#qrCodeContainer").html(
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        upiLink
      )}" alt="QR Code">`
    );

    $("#qrinfotext").text(
      "Scan the QR code above with your UPI app to complete the payment of ₹" +
        carttotal.toFixed(2)
    );

    $("#payNowBtn").text("Pay Now on UPI App: ₹" + carttotal.toFixed(2));

    $("#payNowBtn").click(function () {
      window.location.href = upiLink;
    });
  }
};

$(document).ready(function () {
  $("#shipping_details").submit(function (event) {
    event.preventDefault();
    $("#shipping_details").hide();
    $("#payment_section").show();
    $("#paymentPopupClose").hide();
    $("#PaymentHead").text("Complete Your Payment");
    startCountdown();
  });

  // Handle Pay Now button click
});

function startCountdown() {
  var seconds = 50;
  var countdownInterval = setInterval(function () {
    $("#countdown").text(seconds);

    if (seconds === 10) {
      updateCountdownNotice(
        "Just a few more seconds: Your payment is currently being processed. :)"
      );
    } else if (seconds === 6) {
      updateCountdownNotice("Almost there! We are finalizing your payment.");
    } else if (seconds === 4) {
      updateCountdownNotice("Your payment is secured through UPI.");
    }

    if (seconds <= 0) {
      clearInterval(countdownInterval);
      processData(formData);
    }
    seconds--;
  }, 1000);
}

function updateCountdownNotice(message) {
  $("#countdownNotice").text(message);
}

function processData(formData) {
  var fullName = formData.userName;
  var phoneNumber = formData.phoneNumber;
  var email = formData.email;
  var address = formData.address;
  var city = formData.city;
  var postCode = formData.postCode;

  var deliveryOption = $("input[name='delivery']:checked").val();
  if (deliveryOption == 20) {
    FdeliveryOption = "Domestic Delivery in 5 days ₹" + deliveryOption;
  } else {
    FdeliveryOption = "Express Domestic Delivery in 2 days ₹" + deliveryOption;
  }
  var carttotal = $("#total-total").text(); // Change from .val() to .text()

  // Accessing all item names and prices
  var items = [];
  $(".cart-item").each(function () {
    var itemName = $(this).find(".cart-item-name").text();
    var itemPrice = $(this).find(".cvalue").text();

    items.push({ name: itemName, price: itemPrice });
  });

  // Generate WhatsApp message
  var whatsappNumber = "+919723054735"; // Replace with your WhatsApp number
  var message = `Hello, I would like to place an order.\n-----ORDER DETAILS-----\n ${items.map(
    (data) => `- ${data.name} - Price: ₹${data.price}\n`
  )}\nTOTAL AMOUNT - ₹${carttotal}\nDelivery Option - ${FdeliveryOption}\n\n-----CUSTOMER INFO-----\nName: ${fullName}\nPhone Number: ${phoneNumber}\nEmail: ${email}\nAddress: ${address}\nCity: ${city}\nPostal Code: ${postCode}\n\n-----Payment Status-----\nPending\n\n-------------------\nWe will confirm your order upon receiving the message.`;

  // Generate WhatsApp link
  var whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  window.location.href = whatsappLink;
}

$(document).ready(function () {
  $("#shipping_details").submit(function (event) {
    event.preventDefault();

    // Serialize form data
    var formData = {};
    $.each($(this).serializeArray(), function (i, field) {
      formData[field.name] = field.value;
    });
    startCountdown();

    var seconds = 50;
    var countdownInterval = setInterval(function () {
      if (seconds <= 0) {
        clearInterval(countdownInterval);
        processData(formData);
      }
      seconds--;
    }, 1000);
  });
});
