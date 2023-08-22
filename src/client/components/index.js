const index = {
  init: function () {
    append(
      'body',
      html`
        <style>
          body {
            background: black;
            color: white;
            font-family: monospace;
          }
          .responsive-test {
            background: gray;
          }
        </style>
        <strong> C Y B E R I A </strong>
        <div class="fix center responsive-test"></div>
      `
    );
    this.ResponsiveController.Event['responsive-test'] = () => {
      s('.responsive-test').style.width = `${this.ResponsiveController.Data.Responsive.minValue}px`;
      s('.responsive-test').style.height = `${this.ResponsiveController.Data.Responsive.minValue}px`;
    };
    this.ResponsiveController.init();
  },
  ResponsiveController: {
    Data: {
      Interval: 15,
      Responsive: {},
    },
    Event: {},
    init: function () {
      this.CallBack = () => {
        const Data = getResponsiveData();
        if (Data.minValue !== this.Data.Responsive.minValue || Data.maxValue !== this.Data.Responsive.maxValue) {
          this.Data.Responsive = Data;
          Object.keys(this.Event).map((key) => this.Event[key]());
        }
      };
      this.CallBack();
      this.Interval = setInterval(() => this.CallBack(), this.Data.Interval);
    },
  },
};

index.init();
