import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import PatientLayout from "./PatientLayout";
import "./PatientMessages.css";

function PatientMessages() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load messages");
      }

      setMessages(data.messages || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/contacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load contacts");
      }

      setContacts(data.contacts || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchContacts();
  }, []);

  const conversation = useMemo(() => {
    if (!selectedContact || !user) return [];

    return messages
      .filter((item) => {
        const senderId = item.sender?._id;
        const receiverId = item.receiver?._id;

        return (
          (senderId === user.id &&
            receiverId === selectedContact._id) ||
          (senderId === selectedContact._id &&
            receiverId === user.id)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [messages, selectedContact, user]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!selectedContact || !messageText.trim()) return;

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverId: selectedContact._id,
            subject,
            message: messageText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setMessages((prev) => [data.data, ...prev]);
      setSubject("");
      setMessageText("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await fetch(
        `${API_BASE_URL}/api/messages/${messageId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) =>
        prev.map((item) =>
          item._id === messageId
            ? { ...item, read: true }
            : item
        )
      );
    } catch {
      // Keep the UI working even if read status update fails.
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);

    const unreadMessages = messages.filter(
      (item) =>
        item.sender?._id === contact._id &&
        item.receiver?._id === user?.id &&
        !item.read
    );

    unreadMessages.forEach((item) => {
      markMessageAsRead(item._id);
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter(
    (item) =>
      item.receiver?._id === user?.id &&
      !item.read
  ).length;

  return (
    <PatientLayout>
      <div className="patient-messages-page">
        <div className="messages-heading">
          <div>
            <p className="section-label">MESSAGES</p>
            <h1>Messages</h1>
            <p>
              Communicate securely with your doctors.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="unread-badge">
              {unreadCount} unread
            </div>
          )}
        </div>

        {error && (
          <div className="messages-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="messages-loading">
            Loading messages...
          </div>
        ) : (
          <div className="messages-container">
            <aside className="contacts-panel">
              <div className="contacts-header">
                <h3>Doctors</h3>
                <span>{contacts.length}</span>
              </div>

              {contacts.length === 0 ? (
                <div className="no-contacts">
                  No doctors available.
                </div>
              ) : (
                contacts.map((contact) => {
                  const unread = messages.filter(
                    (item) =>
                      item.sender?._id === contact._id &&
                      item.receiver?._id === user?.id &&
                      !item.read
                  ).length;

                  return (
                    <button
                      key={contact._id}
                      className={`contact-item ${
                        selectedContact?._id === contact._id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectContact(contact)
                      }
                    >
                      <div className="contact-avatar">
                        {contact.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="contact-info">
                        <strong>{contact.name}</strong>
                        <span>
                          {contact.specialization ||
                            "Doctor"}
                        </span>
                      </div>

                      {unread > 0 && (
                        <span className="contact-unread">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </aside>

            <section className="conversation-panel">
              {!selectedContact ? (
                <div className="conversation-empty">
                  <div className="empty-icon">✉</div>
                  <h2>Select a doctor</h2>
                  <p>
                    Choose a doctor from the list to view
                    your conversation.
                  </p>
                </div>
              ) : (
                <>
                  <div className="conversation-header">
                    <div className="contact-avatar">
                      {selectedContact.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h2>{selectedContact.name}</h2>
                      <span>
                        {selectedContact.specialization ||
                          "Doctor"}
                      </span>
                    </div>
                  </div>

                  <div className="conversation-body">
                    {conversation.length === 0 ? (
                      <div className="conversation-empty small">
                        <h3>No messages yet</h3>
                        <p>
                          Send a message to start the
                          conversation.
                        </p>
                      </div>
                    ) : (
                      conversation.map((item) => {
                        const isMine =
                          item.sender?._id === user?.id;

                        return (
                          <div
                            key={item._id}
                            className={`message-row ${
                              isMine ? "mine" : "received"
                            }`}
                          >
                            <div className="message-bubble">
                              {item.subject && (
                                <strong>
                                  {item.subject}
                                </strong>
                              )}

                              <p>{item.message}</p>

                              <span>
                                {formatTime(
                                  item.createdAt
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form
                    className="message-form"
                    onSubmit={handleSend}
                  >
                    <input
                      value={subject}
                      onChange={(e) =>
                        setSubject(e.target.value)
                      }
                      placeholder="Subject (optional)"
                    />

                    <div className="message-input-row">
                      <textarea
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(e.target.value)
                        }
                        placeholder="Write your message..."
                        rows="3"
                      />

                      <button
                        type="submit"
                        disabled={
                          sending || !messageText.trim()
                        }
                      >
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default PatientMessages;