import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Send,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Check,
  Sparkles,
  Car,
  Camera,
  Mic,
  X,
} from 'lucide-react';
import { marketplaceStore } from '../../services/store';
import { VoiceRecorder, VoiceNoteMetadata } from '../common/VoiceRecorder';
import { VEHICLE_DATA, getAvailableModels, getCanonicalMakeName } from '../../data/vehicleData';
import { decodeVin, SAMPLE_VINS } from '../../services/vinDecoder';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface CreatePartRequestViewProps {
  onBack: () => void;
  onRequestSubmitted: (reqId: string) => void;
}

export function CreatePartRequestView({ onBack, onRequestSubmitted }: CreatePartRequestViewProps) {
  const [vehicleMake, setVehicleMake] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Corolla');
  const [vehicleYear, setVehicleYear] = useState('2010');
  const [engineType, setEngineType] = useState('1.6 petrol');
  const [vinInput, setVinInput] = useState('');
  const [partName, setPartName] = useState('Alternator 12V');
  const [partNumber, setPartNumber] = useState('Not sure — see attached photo');
  const [quantity, setQuantity] = useState('1');
  const [preferredCondition, setPreferredCondition] = useState<'New' | 'Used' | 'Either · New or used'>('Either · New or used');
  const [fulfilmentPreference, setFulfilmentPreference] = useState<'Delivery' | 'Collection' | 'Either'>('Either');
  const [location, setLocation] = useState('Serekunda');
  const [notes, setNotes] = useState('Battery warning light is on. Please quote a tested unit with warranty and confirm the fit.');
  const [uploadedImage, setUploadedImage] = useState<string>(alternatorImg);
  const [voiceNoteData, setVoiceNoteData] = useState<VoiceNoteMetadata | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const handleDecodeVin = (val: string) => {
    const result = decodeVin(val);
    if (result && result.make) {
      setVehicleMake(result.make);
      if (result.model) setVehicleModel(result.model);
      if (result.year) setVehicleYear(result.year);
      if (result.engine) setEngineType(result.engine);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const created = marketplaceStore.createRequest({
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleEngine: engineType,
      partName,
      partNumber: partNumber === 'Not sure — see attached photo' ? undefined : partNumber,
      preferredCondition,
      notes: `${notes} · Fulfilment: ${fulfilmentPreference}`,
      image: uploadedImage,
      voiceNote: voiceNoteData || undefined,
    });

    setTimeout(() => {
      setIsSending(false);
      setCreatedRequestId(created.id);
    }, 400);
  };

  // --- Submission Confirmation View (Figma Page 16) ---
  if (createdRequestId) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Home / Request submitted
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Request sent
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Confirmation Text & What Happens Next */}
            <div className="md:col-span-7 space-y-6">
              <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200/80 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-neutral-900">Your request is out there.</h2>
                  <p className="text-xs text-neutral-600">
                    Nearby dealers can now check their shelves and send you a quotation.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-200/80 space-y-2 text-xs">
                <h3 className="font-extrabold text-neutral-900">What happens next?</h3>
                <p className="text-neutral-600 leading-relaxed">
                  We’ll notify you when an offer arrives. Compare fit, condition and the full price.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => onRequestSubmitted(createdRequestId)}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                >
                  View my requests
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-full transition-colors"
                >
                  Back to home
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                No payment needed until you accept an offer.
              </p>
            </div>

            {/* Right Column: Request Summary Box (Figma Page 16) */}
            <div className="md:col-span-5 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 space-y-4 text-xs">
              <h3 className="font-black text-base text-neutral-900">{partName}</h3>
              <div className="space-y-2 border-t border-neutral-200/60 pt-3">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Request</span>
                  <span className="font-mono font-bold text-neutral-800">{createdRequestId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Vehicle</span>
                  <span className="font-semibold text-neutral-800">{vehicleMake} {vehicleModel} · {vehicleYear} · {engineType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Quantity</span>
                  <span className="font-semibold text-neutral-800">{quantity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Area</span>
                  <span className="font-semibold text-neutral-800">{location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Preference</span>
                  <span className="font-semibold text-neutral-800">{fulfilmentPreference}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Form View (Figma Page 14) ---
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Title */}
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home / Request a part</span>
          </button>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Show us what you need.
          </h1>
          <p className="text-xs text-neutral-500">
            A photo and vehicle details help dealers send accurate quotes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Part Details Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 space-y-4 shadow-2xs">
              <h2 className="text-sm font-extrabold text-neutral-900">
                Part details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Part name</label>
                  <input
                    type="text"
                    required
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g. Alternator 12V"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Part number · Optional</label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g. 27060-0T140 or Not sure"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-bold focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Preferred condition</label>
                  <select
                    value={preferredCondition}
                    onChange={(e) => setPreferredCondition(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-neutral-900"
                  >
                    <option value="Either · New or used">Any · OEM, aftermarket or tested used</option>
                    <option value="New">Brand New only</option>
                    <option value="Used">Used · Tested only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Vehicle & Fulfilment Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 space-y-4 shadow-2xs">
              <h2 className="text-sm font-extrabold text-neutral-900">
                Vehicle & fulfilment
              </h2>

              <div className="space-y-4 text-xs">
                {/* Vehicle Details */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Vehicle details</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Make"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      className="px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900"
                    />
                  </div>
                </div>

                {/* Optional VIN decode quick assist */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Auto-fill from VIN · Optional</label>
                  <input
                    type="text"
                    placeholder="Enter 17-character VIN (e.g. 1HGCM82633A123456)"
                    value={vinInput}
                    onChange={(e) => {
                      setVinInput(e.target.value);
                      handleDecodeVin(e.target.value);
                    }}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Serekunda, Westfield, Jeshwang"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl font-medium focus:outline-hidden"
                  />
                </div>

                {/* Fulfilment Tabs: Delivery / Collection / Either */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Fulfilment preference</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Delivery', 'Collection', 'Either'] as const).map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setFulfilmentPreference(pref)}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-colors ${
                          fulfilmentPreference === pref
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes for Dealers */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Notes for dealers</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe symptoms, requirements, connector pins, or warranty needs..."
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl font-medium text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Routing request to dealers...' : 'Send request to dealers'}</span>
            </button>
          </div>

          {/* Right Column (4 cols): Photos & Voice Note (Figma Page 14) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-6 shadow-2xs text-xs">
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900">
                  Photos & voice note
                </h3>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <span className="font-bold text-neutral-700 block">Add part photos</span>
                <span className="text-[11px] text-neutral-400 block">Up to 5 images · JPG or PNG</span>

                {uploadedImage && (
                  <div className="h-32 bg-neutral-50 rounded-2xl border border-neutral-200 p-2 flex items-center justify-center overflow-hidden relative">
                    <img src={uploadedImage} alt="Uploaded sample" className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <label className="w-full py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 rounded-full font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Camera className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Choose files</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Voice Note Recorder */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="font-bold text-neutral-700 block">Attach a voice note for more descriptions</span>
                <VoiceRecorder onAudioRecorded={(data) => setVoiceNoteData(data)} />
              </div>
            </div>

            {/* Help Dealers Guidance Box */}
            <div className="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 space-y-2 text-xs">
              <h4 className="font-bold text-neutral-900">Help dealers identify the part</h4>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                A clear photo and accurate vehicle details help Gambian dealers check physical shelves and quote the right replacement quickly.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
