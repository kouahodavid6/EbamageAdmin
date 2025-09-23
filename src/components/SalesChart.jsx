import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SalesChart = ({ commandes }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!commandes || commandes.length === 0) return;

    // Préparez les données pour le graphique
    const last7Days = getLast7Days();
    const dailySales = calculateDailySales(commandes, last7Days);

    const ctx = chartRef.current.getContext('2d');

    // Détruire l'instance précédente si elle existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: last7Days.map(day => formatDate(day)),
        datasets: [{
          label: 'Ventes (FCFA)',
          data: dailySales,
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('fr-FR') + ' FCFA';
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [commandes]);

  // Fonction pour obtenir les 7 derniers jours
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Fonction pour calculer les ventes par jour
  const calculateDailySales = (commandes, days) => {
    const salesByDay = {};
    
    days.forEach(day => {
      salesByDay[day] = 0;
    });

    commandes.forEach(commande => {
      const commandeDate = new Date(commande.created_at).toISOString().split('T')[0];
      if (salesByDay.hasOwnProperty(commandeDate)) {
        salesByDay[commandeDate] += commande.prix_total_commande;
      }
    });

    return days.map(day => salesByDay[day]);
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default SalesChart;