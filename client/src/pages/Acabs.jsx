import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { PlusCircle, Search, Edit2, Trash2, Shield, Settings, ArrowLeft, RefreshCw, Car } from 'lucide-react';

const Acabs = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await carAPI.getAll();
      setCars(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from UCab database?')) return;
    try {
      await carAPI.delete(id);
      toast.success('Cab removed successfully!');
      fetchCars();
    } catch (err) {
      console.error('Delete car error:', err);
    }
  };

  const handleToggleAvailability = async (car) => {
    try {
      const nextAvail = !car.availability;
      await carAPI.update(car._id, { availability: nextAvail });
      toast.success(`Cab marked as ${nextAvail ? 'Available' : 'Unavailable'}`);
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCars = cars.filter((car) => {
    return (
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 text-left">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700">
              <ArrowLeft className="h-3 w-3" /> Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Manage Cabs</h1>
            <p className="text-slate-500 text-sm">Register new vehicles, update prices, or change availability flags.</p>
          </div>
          
          <div className="flex gap-2.5">
            <button onClick={fetchCars} className="flex items-center gap-1.5 rounded-xl border border-slate-350 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/admin/add-car"
              className="flex items-center gap-1.5 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-400 shadow-md shadow-yellow-500/10"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Cab
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 text-left max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
            placeholder="Search by model, driver, plate no, or type..."
          />
        </div>

        {/* Cab cards grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 border-dashed bg-white py-16 text-center text-slate-400">
            <Car className="mx-auto h-16 w-16 stroke-1 text-slate-300 mb-3" />
            <p className="font-semibold text-slate-700">No cabs registered yet</p>
            <Link to="/admin/add-car" className="mt-4 inline-block text-sm font-bold text-yellow-650 hover:underline">
              Add your first cab
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <div key={car._id} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden text-left flex flex-col justify-between">
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b">
                    {car.carImage ? (
                      <img
                        src={car.carImage.startsWith('/') ? `http://localhost:8000${car.carImage}` : car.carImage}
                        alt={car.model}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Car className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                      {car.carType}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950">{car.model}</h3>
                        <p className="text-xs font-mono uppercase text-slate-450 mt-0.5">{car.carNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 leading-none">Price/km</p>
                        <p className="text-xl font-black text-slate-950">${car.pricePerKm.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Driver Name</span>
                        <strong className="text-slate-800 font-semibold truncate block">{car.driverName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Seats Count</span>
                        <strong className="text-slate-800 font-semibold block">{car.seats} Person</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6 space-y-4">
                  {/* Status Toggle switch */}
                  <div className="flex justify-between items-center bg-slate-50 border p-3 rounded-2xl">
                    <span className="text-xs font-bold text-slate-700">Availability</span>
                    <button
                      onClick={() => handleToggleAvailability(car)}
                      className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase border transition ${
                        car.availability
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-rose-100 border-rose-300 text-rose-800'
                      }`}
                    >
                      {car.availability ? 'Available' : 'Booked/Out'}
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/cabs/edit/${car._id}`}
                      className="flex-1 flex justify-center items-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Edit2 className="h-4 w-4" /> Edit Cab
                    </Link>
                    <button
                      onClick={() => handleDeleteCar(car._id)}
                      className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2.5 transition"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Acabs;
