import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { ArrowLeft, Car, User, IndianRupee, Upload, Save, RefreshCw } from 'lucide-react';

const Acabedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [model, setModel] = useState('');
  const [carType, setCarType] = useState('Hatchback');
  const [carNumber, setCarNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [seats, setSeats] = useState(4);
  const [availability, setAvailability] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const res = await carAPI.getById(id);
        setModel(res.data.model);
        setCarType(res.data.carType);
        setCarNumber(res.data.carNumber);
        setDriverName(res.data.driverName);
        setPricePerKm(res.data.pricePerKm);
        setSeats(res.data.seats);
        setAvailability(res.data.availability);
        if (res.data.carImage) {
          setImagePreview(res.data.carImage.startsWith('/') ? `http://localhost:8000${res.data.carImage}` : res.data.carImage);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load cab information');
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!model || !carNumber || !driverName || !pricePerKm || !seats) {
      return toast.error('Please complete all vehicle fields');
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('model', model);
      formData.append('carType', carType);
      formData.append('carNumber', carNumber);
      formData.append('driverName', driverName);
      formData.append('pricePerKm', pricePerKm);
      formData.append('seats', seats);
      formData.append('availability', availability);
      if (imageFile) {
        formData.append('carImage', imageFile);
      }

      await carAPI.update(id, formData);
      toast.success('Cab information updated successfully!');
      navigate('/admin/cabs');
    } catch (err) {
      console.error('Update cab failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const carTypes = ['Hatchback', 'Sedan', 'SUV', 'Mini', 'Bike'];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-6">
          <Link to="/admin/cabs" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-555 hover:text-slate-900 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Cabs
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Edit Cab Details</h1>
          <p className="text-slate-500 text-sm">Update plate number, driver details, or adjust fare pricing.</p>
        </div>

        {/* Form Container */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 flex justify-center shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 text-left" encType="multipart/form-data">
              
              {/* Image Preview / File input */}
              <div className="flex flex-col items-center gap-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Car preview"
                    className="aspect-video w-full rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100 border-2 border-dashed text-slate-400">
                    <Car className="h-12 w-12" />
                  </div>
                )}
                
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-355 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition">
                  <Upload className="h-3.5 w-3.5" />
                  Change Vehicle Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Model */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-medium">Car Model Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Car className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Plate Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-medium">Car Number Plate</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-mono">
                      #
                    </div>
                    <input
                      type="text"
                      required
                      value={carNumber}
                      onChange={(e) => setCarNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Driver Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-medium">Driver Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rate */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-medium">Price per Kilometer (₹)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <IndianRupee className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={pricePerKm}
                      onChange={(e) => setPricePerKm(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-medium">Cab Category Type</label>
                  <select
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-yellow-500 focus:outline-none bg-white font-medium text-slate-750"
                  >
                    {carTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seats limit */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-medium">Available Seats</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 bg-slate-50 border p-4 rounded-2xl">
                <input
                  type="checkbox"
                  id="availability"
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                />
                <label htmlFor="availability" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Mark as immediately available for customer hire
                </label>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={updating}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-500 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-50 transition shadow-lg shadow-yellow-500/10"
              >
                {updating ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Cab Details
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Acabedit;
