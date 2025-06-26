import React, { useState, useEffect, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Draggable } from "@fullcalendar/interaction";
import "../styles/fullcalendar.min.css";
import "../styles/calendar-custom.css";
import Select from "react-select";

const Calendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const initializedRef = useRef(false);
  
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [isnewevent, setisnewevent] = useState(false);
  const [iseditdelete, setiseditdelete] = useState(false);
  const [event_title, setevent_title] = useState("");
  const [category_color, setcategory_color] = useState("");
  const [calenderevent, setcalenderevent] = useState<any>(null);
  const [addneweventobj, setaddneweventobj] = useState<any>(null);

  // Combined events state for calendar display - using current dates
  const today = new Date();
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 'default-1',
      title: "🎯 Existing Meeting",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
      className: "bg-primary",
    },
    {
      id: 'default-2',
      title: "📈 Weekly Review",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30),
      className: "bg-success",
    },
    {
      id: 'default-3',
      title: "🚀 Project Launch",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),
      className: "bg-warning",
    },
    {
      id: 'default-4',
      title: "🎉 Team Building",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 13, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 18, 0),
      className: "bg-info",
    }
  ]);

  useEffect(() => {
    if (initializedRef.current) {
      console.log("🚫 Calendar already initialized, skipping");
      return;
    }

    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));

    // Initialize external draggable events
    const draggableEl = document.getElementById("calendar-events");
    if (draggableEl) {
      console.log("🚀 Initializing calendar draggable events");

      new Draggable(draggableEl, {
        itemSelector: ".calendar-events",
        eventData: function(eventEl) {
          const title = eventEl.innerText.trim();
          const className = eventEl.getAttribute("data-class");
          return {
            title: title,
            className: className,
            duration: "01:00"
          };
        },
        longPressDelay: 0,
        touchTimeoutDelay: 0
      });

      initializedRef.current = true;
      console.log("✅ Calendar initialization completed");
    }
  }, []);

  const handleDateSelect = useCallback((selectInfo: any) => {
    console.log("📅 Date selected:", selectInfo);
    setaddneweventobj(selectInfo);
    setisnewevent(true);
  }, []);

  const handleEventClick = useCallback((clickInfo: any) => {
    console.log("🖱️ Event clicked:", clickInfo.event);
    setcalenderevent(clickInfo.event);
    setevent_title(clickInfo.event.title);
    setiseditdelete(true);
  }, []);

  const handleEventReceive = useCallback((info: any) => {
    console.log("📥 External event dropped:", info);
    
    const newEvent = {
      id: `external-${Date.now()}`,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      className: info.event.classNames[0] || "bg-primary"
    };

    setCalendarEvents(prev => [...prev, newEvent]);
  }, []);

  const handleEventDrop = useCallback((info: any) => {
    console.log("🔄 Event moved:", info);
    
    setCalendarEvents(prev => 
      prev.map(event => 
        event.id === info.event.id 
          ? { ...event, start: info.event.start, end: info.event.end }
          : event
      )
    );
  }, []);

  const addnewevent = () => {
    let calendarApi = addneweventobj.view.calendar;

    calendarApi.unselect();

    if (event_title) {
      const newEvent = {
        id: `new-${Date.now()}`,
        title: event_title,
        className: category_color,
        start: addneweventobj.startStr,
        end: addneweventobj.endStr,
        allDay: addneweventobj.allDay,
      };

      calendarApi.addEvent(newEvent);
      setCalendarEvents(prev => [...prev, newEvent]);
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
    setCalendarEvents(prev => prev.filter(event => event.id !== calenderevent.id));
    setiseditdelete(false);
  };

  const categoryColorOptions = [
    { value: "bg-danger", label: "🔴 Đỏ", color: "#dc3545" },
    { value: "bg-success", label: "🟢 Xanh lá", color: "#28a745" },
    { value: "bg-primary", label: "🔵 Xanh dương", color: "#007bff" },
    { value: "bg-info", label: "🟦 Xanh nhạt", color: "#17a2b8" },
    { value: "bg-warning", label: "🟡 Vàng", color: "#ffc107" },
    { value: "bg-purple", label: "🟣 Tím", color: "#6f42c1" },
  ];

  return (
    <div className="page-wrapper calendar-page-wrapper">
      <div className="content">
        <div className="calendar-page-header">
          <div className="row align-items-center w-100">
            <div className="col-lg-8 col-sm-12">
              <h3 className="page-title">📅 Beautiful Calendar</h3>
            </div>
            <div className="col-lg-4 col-sm-12 text-end">
              <button
                className="calendar-create-btn"
                onClick={() => setisnewevent(true)}
              >
                Thêm sự kiện
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4">
            <div className="calendar-sidebar">
              <h4 className="card-title">🎯 Drag & Drop Events</h4>
              <div id="calendar-events" className="mb-3">
                <div className="calendar-events" data-class="bg-danger">
                  <i className="fas fa-circle" /> 👥 Họp
                </div>
                <div className="calendar-events" data-class="bg-success">
                  <i className="fas fa-circle" /> 📞 Gọi điện
                </div>
                <div className="calendar-events" data-class="bg-primary">
                  <i className="fas fa-circle" /> 💼 Công việc
                </div>
                <div className="calendar-events" data-class="bg-info">
                  <i className="fas fa-circle" /> 🎯 Mục tiêu
                </div>
                <div className="calendar-events" data-class="bg-warning">
                  <i className="fas fa-circle" /> ⚠️ Quan trọng
                </div>
                <div className="calendar-events" data-class="bg-purple">
                  <i className="fas fa-circle" /> 🎉 Sự kiện
                </div>
              </div>
              
              <div className="calendar-options">
                <label>
                  <input
                    type="checkbox"
                    checked={weekendsVisible}
                    onChange={(e) => setWeekendsVisible(e.target.checked)}
                  />
                  Hiển thị cuối tuần
                </label>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-8">
            <div className="calendar-main-card">
              <div className="card-body">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  locale="vi"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  buttonText={{
                    today: "Hôm nay",
                    month: "Tháng",
                    week: "Tuần",
                    day: "Ngày",
                    prev: "Trước",
                    next: "Sau"
                  }}
                  dayHeaderFormat={{ weekday: 'long' }}
                  titleFormat={{
                    year: 'numeric',
                    month: 'long'
                  }}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={3}
                  weekends={weekendsVisible}
                  droppable={true}
                  dragScroll={true}
                  events={calendarEvents}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  eventReceive={handleEventReceive}
                  eventDrop={handleEventDrop}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isnewevent && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Thêm sự kiện mới</h4>
                <button type="button" className="btn-close" onClick={oncreateeventModalClose}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <label>Tiêu đề sự kiện</label>
                    <input
                      className="form-control"
                      type="text"
                      value={event_title}
                      onChange={(e) => setevent_title(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12">
                    <label>Màu sắc</label>
                    <Select
                      options={categoryColorOptions}
                      value={categoryColorOptions.find(option => option.value === category_color)}
                      onChange={(selectedOption) => setcategory_color(selectedOption?.value || "")}
                      placeholder="Chọn màu sắc"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={oncreateeventModalClose}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={addnewevent}>
                  Thêm sự kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Delete Event Modal */}
      {iseditdelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Chỉnh sửa sự kiện</h4>
                <button type="button" className="btn-close" onClick={onupdateModalClose}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <label>Tiêu đề sự kiện</label>
                    <input
                      className="form-control"
                      type="text"
                      value={event_title}
                      onChange={(e) => setevent_title(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onupdateModalClose}>
                  Hủy
                </button>
                <button type="button" className="btn btn-danger" onClick={removeevent}>
                  Xóa
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  if (calenderevent) {
                    calenderevent.setProp('title', event_title);
                  }
                  onupdateModalClose();
                }}>
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
