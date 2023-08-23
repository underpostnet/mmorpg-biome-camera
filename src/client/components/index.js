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
        </style>
      `
    );
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
