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
    setTimeout(() => {
      this.ResponsiveController.init();
    });
  },
  ResponsiveController: {
    Data: {
      Interval: 15,
      Responsive: {},
    },
    getResponsiveData: function () {
      return newInstance(this.Data.Responsive);
    },
    getResponsiveDataAmplitude: function () {
      const ResponsiveDataAmplitude = newInstance(this.Data.Responsive);
      ResponsiveDataAmplitude.minValue = ResponsiveDataAmplitude.minValue * matrixCellsAmplitude;
      ResponsiveDataAmplitude.maxValue = ResponsiveDataAmplitude.maxValue * matrixCellsAmplitude;
      return ResponsiveDataAmplitude;
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
