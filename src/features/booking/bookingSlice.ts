import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, BookingExtra, GuestInfo } from '../../types';

interface BookingState {
  selectedRoom: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  extras: BookingExtra[];
  guestInfo: GuestInfo | null;
  promoCode: string;
  discount: number;
  step: number;
}

const initialState: BookingState = {
  selectedRoom: null,
  checkIn: '',
  checkOut: '',
  guests: 1,
  extras: [],
  guestInfo: null,
  promoCode: '',
  discount: 0,
  step: 1,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDates: (state, action: PayloadAction<{ checkIn: string; checkOut: string; guests: number }>) => {
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
      state.guests = action.payload.guests;
    },

    setSelectedRoom: (state, action: PayloadAction<Room>) => {
      state.selectedRoom = action.payload;
    },

    addExtra: (state, action: PayloadAction<BookingExtra>) => {
      const existingIndex = state.extras.findIndex(e => e.id === action.payload.id);
      if (existingIndex >= 0) {
        state.extras[existingIndex].quantity += action.payload.quantity;
      } else {
        state.extras.push(action.payload);
      }
    },

    removeExtra: (state, action: PayloadAction<string>) => {
      state.extras = state.extras.filter(e => e.id !== action.payload);
    },

    updateExtraQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const extra = state.extras.find(e => e.id === action.payload.id);
      if (extra) {
        extra.quantity = action.payload.quantity;
      }
    },

    setGuestInfo: (state, action: PayloadAction<GuestInfo>) => {
      state.guestInfo = action.payload;
    },

    setPromoCode: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.promoCode = action.payload.code;
      state.discount = action.payload.discount;
    },

    clearPromoCode: (state) => {
      state.promoCode = '';
      state.discount = 0;
    },

    setBookingStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },

    nextStep: (state) => {
      state.step += 1;
    },

    previousStep: (state) => {
      state.step -= 1;
    },

    clearBooking: (state) => {
      return initialState;
    },
  },
});

export const {
  setBookingDates,
  setSelectedRoom,
  addExtra,
  removeExtra,
  updateExtraQuantity,
  setGuestInfo,
  setPromoCode,
  clearPromoCode,
  setBookingStep,
  nextStep,
  previousStep,
  clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
