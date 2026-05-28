import "./dashboard.css";

const EventsPanel = () => {
  return (
    <aside className="dashboard-sidebar">

      <h3>Upcoming Events</h3>

      <div className="event-card">

        <p>🚀 React Summit</p>

        <span>Jan 5</span>

      </div>

      <div className="event-card">

        <p>💻 Developer Meetup</p>

        <span>Dec 25</span>

      </div>

      <div className="event-card">

        <p>🔥 AI Conference</p>

        <span>Dec 15</span>

      </div>

    </aside>
  );
};

export default EventsPanel;