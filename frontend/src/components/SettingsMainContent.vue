<template>
  <div class="container mt-4">
    <!-- Row for Settings Cards -->
    <div class="row d-flex justify-content-center">
      <!-- Column for Font Settings -->
      <div class="col-md-4 mt-4 mx-3">
        <div class="card mb-3">
          <div class="card-header bg-dark text-white text-center">
            Font Settings
          </div>
          <div class="card-body">
            <p><strong>Adjust your screen font size</strong></p>
            <!-- Small Font Size Example -->
            <div class="mb-3">
              <h3 class="font-example">Sample Text</h3>
              <button class="btn btn-secondary border-dark w-100" @click="$emit('convertToSmall')">Small</button>
            </div>
            <!-- Medium Font Size Example -->
            <div class="mb-3">
              <h2 class="font-example">Sample Text</h2>
              <button class="btn btn-secondary border-dark w-100" @click="$emit('convertToMedium')">Medium</button>
            </div>
            <!-- Large Font Size Example -->
            <div class="mb-3">
              <h1 class="font-example">Sample Text</h1>
              <button class="btn btn-secondary border-dark w-100" @click="$emit('convertToLarge')">Large</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Column for Speech Settings -->
      <div class="col-md-4 mt-4 mx-3">
        <div class="card mb-3">
          <div class="card-header bg-dark text-white text-center">
            Speech Settings
          </div>
          <div class="card-body">
            <p><strong>Enable or disable speech feedback</strong></p>
            <button class="btn btn-light border-dark w-100 mb-3" @click="enableSpeech">Enable Speech</button>
            <button class="btn btn-secondary border-dark w-100 mb-4" @click="disableSpeech">Disable Speech</button>
            <p><strong>Choose your speech accent</strong></p>
            <select id="voiceSelect" class="form-control mb-3"></select>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <button v-if="!isLoggedIn()" class="btn btn-dark" @click="goBackToLogin">
        Back to Login
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsMainContent",
  mounted() {
    this.populateVoiceList();
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.populateVoiceList;
    }
  },
  methods: {
    populateVoiceList() {
      if (typeof speechSynthesis === 'undefined') {
        return;
      }

      var voices = speechSynthesis.getVoices();
      var voiceSelect = document.getElementById('voiceSelect');

      voices.forEach((voice) => {
        var option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;

        if (voice.default) {
          option.textContent += ' — DEFAULT';
        }

        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
      });

      voiceSelect.addEventListener("change", (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const voiceName = selectedOption.getAttribute("data-name");

        // Emit an event to the parent to store the selected voice
        const selectedVoice = voices.find(voice => voice.name === voiceName);
        this.$emit("selectedVoice", selectedVoice);
      });
    },

    enableSpeech() {
      this.$emit("enableSpeech");
    },
    disableSpeech() {
      this.$emit("disableSpeech");
    },
    isLoggedIn() {
      // Logic to check if the user is logged in
      return !!localStorage.getItem('authToken');
    },
    goBackToLogin() {
      this.$router.push('/welcome');
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 100%;
}

.font-example {
  text-align: center;
}

.sample {
  text-align: center;
}

.card {
  height: 100%;
}

.card-header {
  text-align: center;
}

.card-header:hover {
  background-color: #343a40;
}
</style>
