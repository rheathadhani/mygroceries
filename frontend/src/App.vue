<template>
  <div id="app">
    <NavBar v-if="showNavBar" />
    <!-- Listen for events from SettingsMainContent.vue -->
    <router-view @convertToSmall="convertToSmall" @convertToMedium="convertToMedium" @convertToLarge="convertToLarge"
      @enableSpeech="enableSpeech" @disableSpeech="disableSpeech" @selectedVoice="selectedVoice = $event" />

  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";


export default {
  name: "App",
  components: {
    NavBar
  },
  data() {
    return {
      currentConversion: null, // Track the current conversion (Small, Medium, or Large)
      baseFontSize: null, // Store the base font size of paragraphs and headers
      speechEnabled: false, // Toggle for speech functionality
      excludedRoutes: ["/admin", "/welcome"], // List of routes where speech and font scaling are disabled
      selectedVoice: null, // Store the selected speech voice
    };
  },
  computed: {
    showNavBar() {
      const hiddenRoutes = ["/welcome", "/admin"];
      return !hiddenRoutes.includes(this.$route.path);
    }
  },
  watch: {
    // Watch for route changes
    $route(to) {
      this.applyConversion();

      if (this.speechEnabled) {
        this.stopSpeech();
        if (!this.excludedRoutes.includes(to.path)) {
          this.attachMouseoverSpeech();
        }
      }
    }
  },
  methods: {
    enableSpeech() {
      this.speechEnabled = true;
      if (!this.excludedRoutes.includes(this.$route.path)) {
        this.attachMouseoverSpeech();
      }
    },
    disableSpeech() {
      this.speechEnabled = false;
      this.stopSpeech();
      this.removeMouseoverSpeech();
    },
    stopSpeech() {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    },
    speak(text) {
      if (!this.speechEnabled || !text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      speechSynthesis.speak(utterance);
      this.currentUtterance = utterance;
    },
    attachMouseoverSpeech() {
      const elements = document.querySelectorAll("p, h1, h2, h3, label, ul, li, a, span, button, div, img, form, input, select");

      elements.forEach((el) => {
        el.addEventListener("mouseover", this.handleMouseover);
        el.addEventListener("mouseout", this.handleMouseout);

        if (el.tagName.toLowerCase() === "select") {
          el.addEventListener("focus", (event) => {
            const selectElement = event.target;
            const options = selectElement.querySelectorAll("option");
            options.forEach((option) => {
              this.speak(`Option: ${option.textContent.trim()}`);
            });
          });
        }
      });
    },
    removeMouseoverSpeech() {
      const elements = document.querySelectorAll("p, h1, h2, h3, label, ul, li, a, span, button, div, img, form, input, select");

      elements.forEach((el) => {
        el.removeEventListener("mouseover", this.handleMouseover);
        el.removeEventListener("mouseout", this.handleMouseout);
      });
    },

    handleMouseover(event) {
      const el = event.target;
      let prefix = "";

      switch (el.tagName.toLowerCase()) {
        case "p":
        case "h1":
        case "h2":
        case "h3":
        case "label":
        case "span":
          prefix = "";
          break;
        case "button":
          prefix = "Button: ";
          break;
        case "div":
          if (el.id === "app" || el.classList.contains("container") || el.classList.contains("row")) {
            return;
          }
          prefix = "Section: ";
          break;
        case "img": {
          prefix = "Image: ";
          break;
        }
        case "form":
          prefix = "Form: ";
          break;
        case "input": {
          const placeholder = el.getAttribute("placeholder");
          if (placeholder) {
            prefix = `Placeholder: ${placeholder}`;
          } else {
            switch (el.type) {
              case "radio":
                prefix = "Radio button: ";
                break;
              case "date":
                prefix = "Date input: ";
                break;
              case "datetime-local":
                prefix = "Datetime input: ";
                break;
              case "text": {
                const inputLabel = el.getAttribute("aria-label") || "Text input";
                prefix = `${inputLabel}: `;
                break;
              }
              case "textarea":
                prefix = "Text area: ";
                break;
              case "password":
                prefix = "Password input: ";
                break;
              case "email":
                prefix = "Email input: ";
                break;
              case "checkbox":
                prefix = "Checkbox: ";
                break;
              default:
                prefix = "Input field: ";
            }
          }
          break;
        }
        case "select":
          prefix = "Select: ";
          break;
        case "option":
          prefix = "Option: ";
          break;
        case "a":
          prefix = "Link: ";
          break;
        case "ul":
        case "li":
          prefix = "List item: ";
          break;
      }

      // Check if there is text content to speak
      const text = el.textContent.trim();
      if (text) {
        this.speak(`${prefix} ${text}`);
      }

      // Check if the element is an input and has a placeholder attribute
      if (el.tagName.toLowerCase() === "input" && el.getAttribute("placeholder")) {
        const placeholderText = el.getAttribute("placeholder");
        this.speak(`Placeholder: ${placeholderText}`);
      }

      // Save the original border style and apply the red border
      el.dataset.originalBorder = el.style.border;
      el.style.border = "3px solid red";
    },

    handleMouseout(event) {
      const el = event.target;

      // Restore the original border style
      el.style.border = el.dataset.originalBorder || "none";
      delete el.dataset.originalBorder;

      this.stopSpeech();
    },
    applyConversion() {
      if (this.excludedRoutes.includes(this.$route.path)) {
        return;
      }

      if (this.currentConversion) {
        this.$nextTick(() => {
          this[this.currentConversion]();
        });
      }
    },
    convertToSmall() {
      this.currentConversion = "convertToSmall";
      this.resetToDefault();
    },
    convertToMedium() {
      this.currentConversion = "convertToMedium";
      this.adjustFontSize(10);
    },
    convertToLarge() {
      this.currentConversion = "convertToLarge";
      this.adjustFontSize(15);
    },
    adjustFontSize(percentage) {
      const elements = document.querySelectorAll("p, h1, h2, h3, h5, label, ul, li, a, span, button, input, form");
      const baseFontSize = this.baseFontSize || this.getBaseFontSize(elements);

      elements.forEach((element) => {
        const newSize = baseFontSize * (1 + percentage / 100);
        element.style.fontSize = `${newSize}px`;
      });
    },
    resetToDefault() {
      const elements = document.querySelectorAll("p, h1, h2, h3, h5, label, ul, li, a, span, button, input, form");

      elements.forEach((element) => {
        element.style.fontSize = "";
      });
    },
    getBaseFontSize(elements) {
      if (elements.length > 0) {
        const baseSize = parseFloat(window.getComputedStyle(elements[0]).fontSize);
        this.baseFontSize = baseSize;
        return baseSize;
      }
      return 16;
    }
  },
  mounted() {
    if (this.speechEnabled && !this.excludedRoutes.includes(this.$route.path)) {
      this.attachMouseoverSpeech();
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: Arial;
}

#page-wrap {
  margin: auto;
  max-width: 800px;
  min-height: 100vh;
}

button {
  background-color: black;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  outline: 0;
  padding: 16px;
}

p,
h1,
h2,
h3,
label,
ul,
li,
a,
span {
  transition: font-size 0.2s ease-in-out;
}
</style>
