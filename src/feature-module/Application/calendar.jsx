/* eslint-disable no-dupe-keys */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Draggable } from "@fullcalendar/interaction";
// import "../../assets/plugins/fullcalendar/fullcalendar.min.css";
import "../../style/css/fullcalendar.min.css";
// import FullCalendar from '@fullcalendar/react/dist/main.esm.js';

import Select from "react-select";

const Calendar = () => {
  const [startDate, setDate] = useState(new Date()),
    [showCategory, setshowCategory] = useState(false),
    [showmodel, setshowmodel] = useState(false),
    [showEvents, setshowEvents] = useState(false),
    [show, setshow] = useState(false),
    [iseditdelete, setiseditdelete] = useState(false),
    [addneweventobj, setaddneweventobj] = useState(null),
    [isnewevent, setisnewevent] = useState(false),
    [event_title, setevent_title] = useState(""),
    [category_color, setcategory_color] = useState(""),
    [calenderevent, setcalenderevent] = useState(""),
    [weekendsVisible, setweekendsVisible] = useState(true),
    [currentEvents, setscurrentEvents] = useState([]);

  const calendarRef = useRef(null);

  // State to store dropped events temporarily
  const [droppedEvents, setDroppedEvents] = useState([]);

  // Combined events state for calendar display - using current dates
  const today = new Date();
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 'default-1',
      title: "🎯 Existing Meeting",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0), // Today 10:00 AM
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),   // Today 11:00 AM
      className: "bg-primary",
    },
    {
      id: 'default-2',
      title: "📈 Weekly Review",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0), // Tomorrow 2:00 PM
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30),  // Tomorrow 3:30 PM
      className: "bg-success",
    },
    {
      id: 'default-3',
      title: "🚀 Product Demo",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0),  // Day after tomorrow 9:00 AM
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0),   // Day after tomorrow 10:00 AM
      className: "bg-info",
    },
    {
      id: 'default-4',
      title: "🎨 Design Review",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0), // 3 days from now 4:00 PM
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),   // 3 days from now 5:00 PM
      className: "bg-warning",
    },
  ]);
  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));

    // Initialize external draggable events with simple hide/show
    const draggableEl = document.getElementById("calendar-events");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".calendar-events",
        eventData: function(eventEl) {
          const title = eventEl.innerText.trim();
          const className = eventEl.getAttribute("data-class");
          return {
            title: title,
            className: className,
            duration: "01:00" // 1 hour default duration
          };
        },
        longPressDelay: 0,
        touchTimeoutDelay: 0
      });

      // Store reference to currently dragging element
      let currentDragElement = null;
      let dragHelper = null;

      // Listen for drag start from external elements
      draggableEl.addEventListener('dragstart', function(e) {
        const target = e.target.closest('.calendar-events');
        if (target) {
          currentDragElement = target;
          // Hide the original item when dragging starts
          setTimeout(() => {
            if (currentDragElement) {
              currentDragElement.classList.add('dragging-hidden');
            }
          }, 10); // Small delay to let drag start
        }
      });

      // Simple approach - just hide the original item during drag
      // No custom helper, let FullCalendar handle the drag visual

      // Listen for drag end
      document.addEventListener('dragend', function(e) {
        if (currentDragElement) {
          currentDragElement.classList.remove('dragging-hidden');
          currentDragElement = null;
        }
        if (dragHelper && dragHelper.parentNode) {
          dragHelper.parentNode.removeChild(dragHelper);
          dragHelper = null;
        }
      });
    }
  }, []);

  const handleChange = (date) => {
    setDate(date);
  };
  const addEvent = () => {
    setshowEvents(true);
  };
  const categoryHandler = () => {
    setshowCategory(true);
  };

  const handleClose = () => {
    setisnewevent(false);
    setiseditdelete(false);
    setshow(false);
    setshowCategory(false);
    setshowEvents(false);
    setshowmodel(false);
  };

  const handleEventClick = (clickInfo) => {
    setiseditdelete(false);
    setevent_title(clickInfo.event.title);
    setcalenderevent(clickInfo.event);
  };

  const handleDateSelect = (selectInfo) => {
    setisnewevent(true);
    setaddneweventobj(selectInfo);
  };

  const handleEventReceive = (info) => {
    // Handle external drag and drop
    console.log("Event received:", info.event);

    // Prevent FullCalendar from automatically adding the event
    // We'll handle it manually to avoid duplicates
    info.revert();

    // Create event object
    const newEvent = {
      id: `dropped-${Date.now()}`,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || new Date(info.event.start.getTime() + 60 * 60 * 1000), // Default 1 hour duration
      className: info.event.classNames[0] || 'bg-primary',
      droppedAt: new Date().toLocaleString(),
      source: 'external'
    };

    // Add to calendar events state to display on calendar
    setCalendarEvents(prev => [...prev, newEvent]);

    // Add to dropped events list for tracking
    setDroppedEvents(prev => [...prev, newEvent]);

    // Show success notification in console only
    console.log("✅ Event successfully dropped:", newEvent);

    // Show the original item again (in case it was hidden)
    const draggedEl = info.draggedEl;
    if (draggedEl) {
      draggedEl.classList.remove('dragging-hidden');
    }

    // Check if "Remove after drop" is checked
    const removeAfterDrop = document.getElementById("drop-remove").checked;
    if (removeAfterDrop) {
      // Remove the dragged element from the external list
      info.draggedEl.remove();
      console.log("🗑️ Original event removed from sidebar");
    }
  };

  const handleEventDrop = (info) => {
    // Handle internal event drag and drop
    console.log("Event dropped:", info.event);
  };
  const addnewevent = () => {
    let calendarApi = addneweventobj.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (event_title) {
      calendarApi.addEvent({
        id: 10,
        title: event_title,
        className: category_color,
        start: addneweventobj.startStr,
        end: addneweventobj.endStr,
        allDay: addneweventobj.allDay,
      });
    }
    setisnewevent(false);
  };

  const onupdateModalClose = () => {
    setiseditdelete(false);
    setevent_title("");
  };
  const oncreateeventModalClose = () => {
    setevent_title("");
    setisnewevent(false);
  };
  const removeevent = () => {
    calenderevent.remove();
    setiseditdelete(false);
  };
  const clickupdateevent = () => {
    const newArray = [...calendarEvents];
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].id === parseInt(calenderevent.id)) {
        newArray[i].title = event_title;
      }
    }
    setCalendarEvents(newArray);
    setiseditdelete(false);
  };

  const handleClick = () => {
    setshow(true);
  };
  // console.log("showmodel", showmodel);

  const options1 = [
    { value: "Success", label: "Success" },
    { value: "Danger", label: "Danger" },
    { value: "Info", label: "Info" },
    { value: "Primary", label: "Primary" },
    { value: "Warning", label: "Warning" },
    { value: "Inverse", label: "Inverse" },
  ];

  const defaultValue = options1[0];

  return (
    <>
      <div className="page-wrapper calendar-page-wrapper">
        <div className="content">
          <div className="calendar-page-header">
            <div className="row align-items-center w-100">
              <div className="col-lg-8 col-sm-12">
                <h3 className="page-title">📅 Beautiful Calendar</h3>
              </div>
              <div className="col-lg-4 col-sm-12 text-end">
                <a
                  href="#"
                  className="calendar-create-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#add_event"
                >
                  Create Event
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="calendar-sidebar">
                <h4 className="card-title">🎯 Drag & Drop Events</h4>
                <div id="calendar-events" className="mb-3">
                  <div className="calendar-events" data-class="bg-primary">
                    <i className="fas fa-circle" /> 👥 Team Meeting
                  </div>
                  <div className="calendar-events" data-class="bg-success">
                    <i className="fas fa-circle" /> 📊 Project Review
                  </div>
                  <div className="calendar-events" data-class="bg-warning">
                    <i className="fas fa-circle" /> 📞 Client Call
                  </div>
                  <div className="calendar-events" data-class="bg-danger">
                    <i className="fas fa-circle" /> 🎨 Design Workshop
                  </div>
                  <div className="calendar-events" data-class="bg-info">
                    <i className="fas fa-circle" /> 💻 Code Review
                  </div>
                  <div className="calendar-events" data-class="bg-secondary">
                    <i className="fas fa-circle" /> 🍽️ Lunch Break
                  </div>
                  <div className="calendar-events" data-class="bg-purple">
                    <i className="fas fa-circle" /> 📚 Training Session
                  </div>
                  <div className="calendar-events" data-class="bg-success">
                    <i className="fas fa-circle" /> 🏃 Sprint Planning
                  </div>
                  <div className="calendar-events" data-class="bg-info">
                    <i className="fas fa-circle" /> 🔍 Bug Triage
                  </div>
                  <div className="calendar-events" data-class="bg-warning">
                    <i className="fas fa-circle" /> ☕ Coffee Chat
                  </div>
                </div>
                <div className="checkbox mb-3">
                  <input id="drop-remove" className="me-1" type="checkbox" />
                  <label htmlFor="drop-remove">Remove after drop</label>
                </div>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_new_event"
                  className="calendar-add-category-btn"
                >
                  <i className="fas fa-plus" /> Add Category
                </a>

                {/* Dropped Events Tracker */}
                {droppedEvents.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-success">✅ Recently Dropped Events ({droppedEvents.length})</h5>
                    <div className="dropped-events-list">
                      {droppedEvents.slice(-5).map((event, index) => (
                        <div key={event.id} className="dropped-event-item mb-2 p-2 border rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{event.title}</strong>
                              <br />
                              <small className="text-muted">
                                📅 {event.start.toLocaleDateString()} at {event.start.toLocaleTimeString()}
                              </small>
                              <br />
                              <small className="text-success">
                                ⏰ Dropped: {event.droppedAt}
                              </small>
                            </div>
                            <span className={`badge ${event.className}`}>
                              {event.className.replace('bg-', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {droppedEvents.length > 5 && (
                        <small className="text-muted">
                          ... and {droppedEvents.length - 5} more events
                        </small>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="calendar-main-card">
                <div className="card-body">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={3} // Show max 3 events per day, then +more
                    weekends={weekendsVisible}
                    droppable={true} // Enable dropping external events
                    dragScroll={true}
                    events={calendarEvents} // Use dynamic events state
                    select={handleDateSelect}
                    eventClick={(clickInfo) => handleEventClick(clickInfo)}
                    eventReceive={handleEventReceive} // Handle external drops
                    eventDrop={handleEventDrop} // Handle internal drops
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Event Modal */}
      <div id="add_event" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Event</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>
                    Event Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>
                    Event Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <input className="form-control " type="text" />
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Event Modal */}
      {/* Add Event Modal */}
      <div className="modal custom-modal fade none-border" id="my_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Event</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body" />
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-success save-event submit-btn"
              >
                Create event
              </button>
              <button
                type="button"
                className="btn btn-danger delete-event submit-btn"
                data-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Event Modal */}
      {/* Add Category Modal */}
      <div className="modal custom-modal fade" id="add_new_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Category</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    className="form-control form-white"
                    placeholder="Enter name"
                    type="text"
                    name="category-name"
                  />
                </div>
                <div className="form-group mb-0">
                  <label>Choose Category Color</label>
                  <Select
                    className="form-control form-white"
                    defaultValue={defaultValue}
                    options={options1}
                    placeholder="Success"
                  />
                </div>
                <div className="submit-section">
                  <button
                    type="button"
                    className="btn btn-primary save-category submit-btn"
                    data-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category Modal */}
    </>
  );
};

export default Calendar;
