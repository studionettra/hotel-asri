export default function StatCard({ title, value, sub, color = 'primary', icon = 'bi-graph-up', cols = 'col-12 col-sm-6 col-xl-3' }) {
    const labelStyle = { fontSize: '0.7rem', letterSpacing: '0.06em' };
    
    return (
        <div className={cols}>
            <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                    <div className={`bg-${color}-subtle text-${color} rounded-circle d-inline-flex align-items-center justify-content-center mb-3 flex-shrink-0`} style={{ width: 56, height: 56 }}>
                        <i className={`bi ${icon} fs-3`}></i>
                    </div>
                    <div className="text-uppercase fw-semibold text-body-secondary mb-2" style={labelStyle}>{title}</div>
                    <h4 className="mb-0 fw-bold">{value}</h4>
                    {sub && <div className="text-body-secondary mt-2" style={{ fontSize: '0.75rem' }}>{sub}</div>}
                </div>
            </div>
        </div>
    );
}
