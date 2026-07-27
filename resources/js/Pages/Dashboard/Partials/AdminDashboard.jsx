import Chart from 'react-apexcharts';
import StatCard from '@/Components/StatCard';

export default function AdminDashboard({ data }) {
    const revenueChartOptions = {
        chart: { type: 'line', height: 300, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#435ebe'],
        xaxis: { categories: data.revenue_trend.categories },
        dataLabels: { enabled: false },
    };

    const occupancyChartOptions = {
        chart: { type: 'area', height: 300, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { opacity: 0.3 },
        colors: ['#5ddab4'],
        xaxis: { categories: data.occupancy_trend.categories },
        yaxis: { max: 100, min: 0 },
        dataLabels: { enabled: false },
    };

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <div>
            <div className="row g-3 mb-4">
                <StatCard title="Tingkat Hunian" value={`${data.occupancy_rate}%`} color="primary" icon="bi-building" cols="col-12 col-md-4" />
                <StatCard title="Pendapatan Hari Ini" value={formatCurrency(data.revenue_today)} color="success" icon="bi-cash-stack" cols="col-12 col-md-4" />
                <StatCard title="Tamu Aktif" value={data.active_guests} color="info" icon="bi-people" cols="col-12 col-md-4" />
                <StatCard title="Kamar Tersedia (VC)" value={data.available_rooms} color="primary" icon="bi-door-open" cols="col-12 col-md-4" />
                <StatCard title="Reservasi Baru" value={data.new_reservations} color="warning" icon="bi-calendar-plus" cols="col-12 col-md-4" />
                <StatCard title="Kamar OOO / OOS" value={data.ooo_rooms} color="danger" icon="bi-tools" cols="col-12 col-md-4" />
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-transparent border-0 pt-4 pb-0">
                            <h5 className="mb-0 fw-bold">Tren Pendapatan (7 Hari Terakhir)</h5>
                        </div>
                        <div className="card-body">
                            <Chart options={revenueChartOptions} series={[{ name: 'Pendapatan', data: data.revenue_trend.data }]} type="line" height={300} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-transparent border-0 pt-4 pb-0">
                            <h5 className="mb-0 fw-bold">Tren Hunian (7 Hari Terakhir)</h5>
                        </div>
                        <div className="card-body">
                            <Chart options={occupancyChartOptions} series={[{ name: 'Tingkat Hunian', data: data.occupancy_trend.data }]} type="area" height={300} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
