const { createApp } = Vue;

createApp({
  data() {
    return {
      heroes: [],
      heroInModal: { id: null, name: null, attribute: null }
    };
  },
  async created() {
    try {
      const response = await fetch('http://localhost:8080/heroes');
      this.heroes = await response.json();
    } catch (error) {
      console.error('Error fetching heroes:', error);
    }
  },
  methods: {
    async getHero(id) {
      try {
        const response = await fetch(`http://localhost:8080/heroes/${id}`);
        const data = await response.json();
        this.heroInModal = data;

        const modal = new bootstrap.Modal(document.getElementById('heroInfoModal'));
        modal.show();
      } catch (error) {
        console.error('Error fetching hero:', error);
      }
    }
  }
}).mount('#app');
