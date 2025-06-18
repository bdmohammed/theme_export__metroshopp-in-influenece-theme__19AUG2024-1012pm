(() => {
  // Decode the base64 strings
  const eventType = "visibilitychange"; // "atob(dmlzaWJpbGl0eWNoYW5nZQ==)"
  const visibleState = "visible"; // "dmlzaWJsZQ=="
  const elementId = "inactive_tab"; // "dDRzLWluYWN0aXZlX3RhYg=="

  // Parse JSON data from the innerHTML of the decoded element ID
  const config = JSON.parse(document.getElementById(elementId).innerHTML);

  // Get the title tag element
  config.titleTag = document.getElementsByTagName("title")[0];
  if (config.titleTag) {
    // Store the original title
    config.originalTitle = config.titleTag.innerText;

    // Determine if there is only one message (for single message mode)
    config.isSingle = config.message.length < 2;
    config.isActive = false;
    config.myTimer = null;

    // Event listener for visibility change
    document.addEventListener(eventType, () => {
      if (document.visibilityState === visibleState) {
        handlePageVisible();
      } else {
        handlePageHidden();
      }
    });

    // Handle when the page becomes visible
    function handlePageVisible() {
      if (!config.isActive) return;
      clearInterval(config.myTimer);
      config.titleTag.innerText = config.originalTitle;
    }

    // Handle when the page becomes hidden
    function handlePageHidden() {
      let currentIndex = 0;
      let currentMessage = config.message[currentIndex];

      config.isActive = true;
      config.titleTag.innerText = currentMessage;

      if (config.isSingle) return;

      config.myTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % config.message.length;
        currentMessage = config.message[currentIndex];
        config.titleTag.innerText = currentMessage;
      }, config.delay);
    }
  }
})();
