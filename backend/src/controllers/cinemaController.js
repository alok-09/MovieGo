import Cinema from '../models/Cinema.js';

export const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCinema = async (req, res) => {
  try {
    const cinema = new Cinema(req.body);
    const newCinema = await cinema.save();
    res.status(201).json(newCinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    res.json(cinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    res.json({ message: 'Cinema deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedCinemas = async (req, res) => {
  try {
    await Cinema.deleteMany({});

    const cinemas = [
      {
        name: "Cineplex Downtown",
        location: "123 Main St, Downtown",
        distance: "0.5 km",
        rating: 4.5,
        totalSeats: 120
      },
      {
        name: "Movieplex Center",
        location: "456 Oak Ave, Midtown",
        distance: "1.2 km",
        rating: 4.3,
        totalSeats: 100
      },
      {
        name: "Grand Cinema Palace",
        location: "789 Park Blvd, Uptown",
        distance: "2.5 km",
        rating: 4.7,
        totalSeats: 150
      },
      {
        name: "StarLight Cinema",
        location: "321 Elm St, Westside",
        distance: "3.0 km",
        rating: 4.6,
        totalSeats: 130
      },
      {
        name: "Regal Moviehouse",
        location: "654 Maple Ave, Eastside",
        distance: "1.8 km",
        rating: 4.4,
        totalSeats: 110
      }
    ];

    const createdCinemas = await Cinema.insertMany(cinemas);
    res.status(201).json({
      message: 'Cinemas seeded successfully',
      count: createdCinemas.length,
      cinemas: createdCinemas
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
