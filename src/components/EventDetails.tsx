// EventDetails.tsx

const EventDetails: React.FC = () => {
    const events = [
      {
        title: "Moms & Mochas Meetup",
        date: "Saturday, April 27, 2025",
        time: "10:00 AM – 1:00 PM",
        location: "Hidden Mother Brewery",
        address: "123 Brew Lane, Kettle Falls, WA",
        description: "Join us for a laid-back morning with coffee, playtime, and local vendors. Kids welcome!",
        rsvpLink: "https://www.facebook.com/events/123456789",
      },
      {
        title: "Dads & Donuts Morning",
        date: "Saturday, May 11, 2025",
        time: "9:00 AM – 12:00 PM",
        location: "Sunrise Coffee Co.",
        address: "456 Roast Ave, Colville, WA",
        description: "A relaxing morning for dads and kids with donuts, crafts, and free espresso shots!",
        rsvpLink: "https://www.facebook.com/events/987654321",
      },
    ];
  
    return (
      <div className="space-y-6">
        <div> 
            <span
                style={{ fontFamily: '"Rock 3D", cursive' }}
                className="flex justify-center text-4xl md:text-6xl text-orange-400 tracking-tighter font-extrabold p-4">UPCOMING EVENTS
            </span>
      </div> 
        {events.map((event, index) => (
          <div key={index} className="border rounded-lg shadow-md p-6 bg-orange-50 max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl font-bold mb-2 text-orange-500">{event.title}</h2>
            <p className="text-sm text-gray-600 mb-1">{event.date} • {event.time}</p>
            <p className="font-medium text-gray-800 mb-1">{event.location}</p>
            <p className="text-sm text-gray-600 mb-4">{event.address}</p>
            <p className="text-gray-700 mb-4">{event.description}</p>
            <a
              href={event.rsvpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              RSVP / Learn More
            </a>
          </div>
        ))}
      </div>
    );
  };
  
  export default EventDetails;
  