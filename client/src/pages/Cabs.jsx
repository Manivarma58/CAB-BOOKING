import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { carAPI } from '../api';
import Navbar from '../components/Navbar';
import { Search, SlidersHorizontal, Users, DollarSign, Car as CarIcon, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Cabs = () => {
  const { selectCar } = useBooking();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // asc / desc

  useEffect(() => {
    const fetchAvailableCars = async () => {
      setLoading(true);
      try {
        const res = await carAPI.getAvailable();
        setCars(res.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableCars();
  }, []);

  const handleBookCar = (car) => {
    selectCar(car);
    toast.success(`${car.model} selected. Complete your route configuration.`);
    navigate('/book-cab');
  };

  // Perform client side search and filters
  const filteredCars = cars
    .filter((car) => {
      const matchesSearch =
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.carNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'All' || car.carType === selectedType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.pricePerKm - b.pricePerKm;
      } else {
        return b.pricePerKm - a.pricePerKm;
      }
    });

  const carTypes = ['All', 'Hatchback', 'Sedan', 'SUV', 'Mini', 'Bike'];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Cabs</h1>
          <p className="text-slate-500 text-sm">Select the perfect ride for your destination.</p>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Search by car model or driver name..."
            />
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-primary focus:outline-none bg-white"
            >
              {carTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition bg-white"
          >
            <ArrowUpDown className="h-4 w-4" />
            Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
          </button>
        </div>

        {/* Cars List Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 border-dashed bg-white py-16 text-center text-slate-400">
              <CarIcon className="mx-auto h-16 w-16 text-slate-300 stroke-1 mb-3" />
              <p className="text-lg font-bold">No cabs found matching criteria</p>
              <p className="text-sm mt-1 text-slate-400">Try altering your search or type filter.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car) => (
                <div key={car._id} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md text-left flex flex-col justify-between">
                  <div>
                    {/* Car Image Banner */}
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      {car.carImage ? (
                        <img
                          src={car.carImage.startsWith('/') ? `http://localhost:8000${car.carImage}` : car.carImage}
                          alt={car.model}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <CarIcon className="h-12 w-12" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        {car.carType}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-slate-950">{car.model}</h3>
                          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{car.carNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 leading-none">Price/km</p>
                          <p className="text-xl font-black text-slate-950">₹{car.pricePerKm.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 border-t border-slate-100 pt-4 text-sm text-slate-650">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>{car.seats} Seats</span>
                        </div>
                        <div className="text-slate-400">|</div>
                        <div>
                          <span className="text-slate-400">Driver:</span>{' '}
                          <span className="font-semibold text-slate-800">{car.driverName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleBookCar(car)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                    >
                      Book Cab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cabs;
