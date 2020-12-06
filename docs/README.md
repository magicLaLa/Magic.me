---
pageClass: custom-home-class
home: true
heroImage: /bg/home-bg.jpg
heroImageStyle: {
  width: 100%,
  height: 100%,
  display: block,
  margin: 0,
}
tagline: ''
bgImage: ''
bgImageStyle: {
  height: '350px'
}
---

<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.rainyDay();
    });
  },
  methods: {
    rainyDay: () => {
      var image = document.querySelector('.home-blog .hero .hero-img');
      image.onload = function () {
        var engine = new RainyDay({
          image: this,
          blur: 0,
          opacity: 0.7,
          parentElement: document.querySelector('.home-blog .hero'),
        });
        engine.rain([
            [2, 1, 0.88],
            [2, 3, 0.9],
        ], 80);
      };
      image.crossOrigin = 'anonymous';
      image.src = '/bg/home-bg.jpg';
    }
  }
}
</script>