import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── User Profiles ──────────────────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Feedback ───────────────────────────────────────────────────────────────

  public type FeedbackStatus = { #pending; #approved; #rejected };
  public type Feedback = {
    id : Nat;
    name : Text;
    rating : Nat;
    review : Text;
    status : FeedbackStatus;
    createdAt : Int;
  };

  var nextFeedbackId : Nat = 0;
  let feedbackStore = Map.empty<Nat, Feedback>();

  /// Anyone (including guests) can submit feedback.
  public shared func submitFeedback(name : Text, rating : Nat, review : Text) : async Nat {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Invalid rating: must be between 1 and 5");
    };
    let id = nextFeedbackId;
    nextFeedbackId += 1;
    let entry : Feedback = {
      id;
      name;
      rating;
      review;
      status = #pending;
      createdAt = Time.now();
    };
    feedbackStore.add(id, entry);
    id;
  };

  /// Public: only approved feedback is returned (no auth required).
  public query func getApprovedFeedback() : async [Feedback] {
    let result = List.empty<Feedback>();
    for ((_, fb) in feedbackStore.entries()) {
      switch (fb.status) {
        case (#approved) { result.add(fb) };
        case (_) {};
      };
    };
    result.toArray();
  };

  /// Public: view all pending feedback.
  public query func getPendingFeedback() : async [Feedback] {
    let result = List.empty<Feedback>();
    for ((_, fb) in feedbackStore.entries()) {
      switch (fb.status) {
        case (#pending) { result.add(fb) };
        case (_) {};
      };
    };
    result.toArray();
  };

  /// Public: view all feedback regardless of status.
  public query func getAllFeedback() : async [Feedback] {
    let result = List.empty<Feedback>();
    for ((_, fb) in feedbackStore.entries()) {
      result.add(fb);
    };
    result.toArray();
  };

  /// Public: approve a feedback entry.
  public shared func approveFeedback(id : Nat) : async () {
    switch (feedbackStore.get(id)) {
      case (null) { Runtime.trap("Feedback not found") };
      case (?fb) {
        let updated : Feedback = {
          id = fb.id;
          name = fb.name;
          rating = fb.rating;
          review = fb.review;
          status = #approved;
          createdAt = fb.createdAt;
        };
        feedbackStore.add(id, updated);
      };
    };
  };

  /// Public: reject a feedback entry.
  public shared func rejectFeedback(id : Nat) : async () {
    switch (feedbackStore.get(id)) {
      case (null) { Runtime.trap("Feedback not found") };
      case (?fb) {
        let updated : Feedback = {
          id = fb.id;
          name = fb.name;
          rating = fb.rating;
          review = fb.review;
          status = #rejected;
          createdAt = fb.createdAt;
        };
        feedbackStore.add(id, updated);
      };
    };
  };

  // ── Appointments ───────────────────────────────────────────────────────────

  public type AppointmentStatus = { #pending; #approved; #rejected };
  public type Appointment = {
    id : Nat;
    date : Text;
    timeSlot : Text;
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    status : AppointmentStatus;
    createdAt : Int;
  };

  var nextAppointmentId : Nat = 0;
  let appointmentStore = Map.empty<Nat, Appointment>();

  /// Blocked dates store (ISO date strings, e.g. "2024-12-25").
  let blockedDates = Set.empty<Text>();

  /// Anyone (including guests) can book an appointment.
  public shared func submitAppointment(
    date : Text,
    timeSlot : Text,
    name : Text,
    phone : Text,
    email : Text,
    message : Text,
  ) : async Nat {
    if (blockedDates.contains(date)) {
      Runtime.trap("Selected date is blocked and unavailable for booking");
    };
    let id = nextAppointmentId;
    nextAppointmentId += 1;
    let entry : Appointment = {
      id;
      date;
      timeSlot;
      name;
      phone;
      email;
      message;
      status = #pending;
      createdAt = Time.now();
    };
    appointmentStore.add(id, entry);
    id;
  };

  /// Public: get the list of blocked dates so the frontend can disable them.
  public query func getBlockedDates() : async [Text] {
    blockedDates.toArray();
  };

  /// Public: view all appointments.
  public query func getAllAppointments() : async [Appointment] {
    let result = List.empty<Appointment>();
    for ((_, appt) in appointmentStore.entries()) {
      result.add(appt);
    };
    result.toArray();
  };

  /// Public: approve an appointment.
  public shared func approveAppointment(id : Nat) : async () {
    switch (appointmentStore.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appt) {
        let updated : Appointment = {
          id = appt.id;
          date = appt.date;
          timeSlot = appt.timeSlot;
          name = appt.name;
          phone = appt.phone;
          email = appt.email;
          message = appt.message;
          status = #approved;
          createdAt = appt.createdAt;
        };
        appointmentStore.add(id, updated);
      };
    };
  };

  /// Public: reject an appointment.
  public shared func rejectAppointment(id : Nat) : async () {
    switch (appointmentStore.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appt) {
        let updated : Appointment = {
          id = appt.id;
          date = appt.date;
          timeSlot = appt.timeSlot;
          name = appt.name;
          phone = appt.phone;
          email = appt.email;
          message = appt.message;
          status = #rejected;
          createdAt = appt.createdAt;
        };
        appointmentStore.add(id, updated);
      };
    };
  };

  /// Public: add a date to the blocked list.
  public shared func addBlockedDate(date : Text) : async () {
    blockedDates.add(date);
  };

  /// Public: remove a date from the blocked list.
  public shared func removeBlockedDate(date : Text) : async () {
    blockedDates.remove(date);
  };

  // ── Aggregated Response for Dashboard ──────────────────────────────────────

  public type DashboardData = {
    appointments : [Appointment];
    feedbacks : [Feedback];
  };

  /// Public: get all appointments and all feedback in a single query.
  public query func getDashboardData() : async DashboardData {
    let appointmentsList = List.empty<Appointment>();
    for ((_, appt) in appointmentStore.entries()) {
      appointmentsList.add(appt);
    };

    let feedbacksList = List.empty<Feedback>();
    for ((_, fb) in feedbackStore.entries()) {
      feedbacksList.add(fb);
    };

    {
      appointments = appointmentsList.toArray();
      feedbacks = feedbacksList.toArray();
    };
  };
};
