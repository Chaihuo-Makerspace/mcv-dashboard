// map-animation.js
// Futuristic neon China map renderer with hover effects

class MapAnimator {
  constructor(chartInstance, config) {
    this.chart = chartInstance;
    this.config = config;
    this.visitedProvinces = new Set(JSON.parse(localStorage.getItem('visitedProvinces') || '[]'));
    this.currentProvince = null;
    this.initChart();
    this.bindEvents();
    if (this.visitedProvinces.size > 0) this._applyHighlights();
  }

  initChart() {
    const theme = this.config.theme;
    this.chart.setOption({
      backgroundColor: theme.backgroundColor,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(4, 10, 24, 0.9)',
        borderColor: '#00f0ff',
        borderWidth: 1,
        textStyle: { color: '#e8f4ff', fontFamily: 'Rajdhani' },
        extraCssText: 'box-shadow: 0 0 20px rgba(0, 240, 255, 0.25); border-radius: 8px;',
        formatter: '{b}'
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.25,
        center: [102.114129, 36.550339],
        itemStyle: {
          areaColor: theme.mapAreaColor,
          borderColor: theme.mapBorderColor,
          borderWidth: 1.2,
          shadowColor: 'rgba(0, 240, 255, 0.25)',
          shadowBlur: 14
        },
        label: {
          show: true,
          color: 'rgba(232, 244, 255, 0.45)',
          fontSize: 10,
          fontFamily: 'Rajdhani'
        },
        emphasis: {
          itemStyle: {
            areaColor: theme.mapEmphasisColor,
            shadowColor: '#00f0ff',
            shadowBlur: 24,
            borderColor: '#00f0ff',
            borderWidth: 1.5
          },
          label: {
            show: true,
            color: theme.labelColor,
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily: 'Orbitron'
          }
        }
      },
      series: []
    });
  }

  _applyHighlights() {
    const theme = this.config.theme;
    const regions = [...this.visitedProvinces].map(name => {
      const isCurrent = name === this.currentProvince;
      return {
        name,
        itemStyle: {
          areaColor: isCurrent ? theme.currentAreaColor : theme.visitedAreaColor,
          borderColor: '#00f0ff',
          shadowColor: '#00f0ff',
          shadowBlur: isCurrent ? theme.currentShadowBlur : theme.visitedShadowBlur,
          borderWidth: isCurrent ? 1.5 : 1
        },
        label: { color: '#fff', fontWeight: 'bold', fontFamily: 'Orbitron' }
      };
    });
    this.chart.setOption({ geo: { regions } });
  }

  highlightProvince(provinceName) {
    if (!provinceName) return;
    this.currentProvince = provinceName;
    this.visitedProvinces.add(provinceName);
    localStorage.setItem('visitedProvinces', JSON.stringify([...this.visitedProvinces]));
    this._applyHighlights();
  }

  bindEvents() {
    this.chart.on('mouseover', (params) => {
      if (params.componentType === 'geo') {
        const event = new CustomEvent('nodeHovered', { detail: { name: params.name } });
        window.dispatchEvent(event);
      }
    });

    this.chart.on('mouseout', (params) => {
      if (params.componentType === 'geo') {
        const event = new CustomEvent('nodeHovered', { detail: null });
        window.dispatchEvent(event);
      }
    });
  }
}

window.MapAnimator = MapAnimator;
