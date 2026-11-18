import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const fetchData = async () => {
    try {
      const [messagesResponse, contactsResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/messages`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_BASE_URL}/api/messages/contacts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const messagesData = await messagesResponse.json();
      const contactsData = await contactsResponse.json();

      if (!messagesResponse.ok) {
        throw new Error(
          messagesData.message || "Failed to load messages"
        );
      }

      if (!contactsResponse.ok) {
        throw new Error(
          contactsData.message || "Failed to load contacts"
        );
      }

      setMessages(messagesData.messages || []);
      setContacts(contactsData.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredContacts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return contacts;

    return contacts.filter(
      (contact) =>
        contact.name?.toLowerCase().includes(value) ||
        contact.email?.toLowerCase().includes(value)
    );
  }, [contacts, search]);

  const conversation = useMemo(() => {
    if (!selectedContact) return [];

    return messages
      .filter(
        (message) =>
          (message.sender?._id === selectedContact._id &&
            message.receiver?._id === currentUser.id) ||
          (message.receiver?._id === selectedContact._id &&
            message.sender?._id === currentUser.id)
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [messages, selectedContact, currentUser.id]);

  const selectContact = async (contact) => {
    setSelectedContact(contact);

    const unreadMessages = messages.filter(
      (message) =>
        message.sender?._id === contact._id &&
        message.receiver?._id === currentUser.id &&
        !message.read
    );

    for (const message of unreadMessages) {
      try {
        await fetch(
          `${API_BASE_URL}/api/messages/${message._id}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch {
        // Ignore read-status errors.
      }
    }

    if (unreadMessages.length) {
      setMessages((previous) =>
        previous.map((message) =>
          unreadMessages.some(
            (item) => item._id === message._id
          )
            ? { ...message, read: true }
            : message
        )
      );
    }
  };

  const sendMessage = async (e) => {
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
        throw new Error(
          data.message || "Failed to send message"
        );
      }

      setMessages((previous) => [
        ...previous,
        data.data,
      ]);

      setMessageText("");
      setSubject("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter(
    (message) =>
      message.receiver?._id === currentUser.id &&
      !message.read
  ).length;

  return (
    <DoctorLayout>
      <div className="doctor-messages-page">
        <div className="doctor-messages-heading">
          <div>
            <span className="doctor-page-label">
              COMMUNICATION
            </span>

            <h1>Messages</h1>

            <p>
              Communicate directly with your patients and care team.
            </p>
          </div>

          <div className="doctor-message-count">
            <strong>{unreadCount}</strong>
            <span>Unread</span>
          </div>
        </div>

        {error && (
          <div className="doctor-message-error">
            {error}
          </div>
        )}

        <div className="doctor-messages-container">
          <aside className="doctor-contact-panel">
            <div className="doctor-contact-header">
              <h3>Contacts</h3>
              <span>{contacts.length}</span>
            </div>

            <div className="doctor-contact-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="doctor-contact-list">
              {loading ? (
                <div className="doctor-contact-empty">
                  Loading...
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="doctor-contact-empty">
                  No contacts found.
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const unread = messages.some(
                    (message) =>
                      message.sender?._id === contact._id &&
                      message.receiver?._id === currentUser.id &&
                      !message.read
                  );

                  return (
                    <button
                      type="button"
                      key={contact._id}
                      className={`doctor-contact ${
                        selectedContact?._id === contact._id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => selectContact(contact)}
                    >
                      <div className="doctor-contact-avatar">
                        {contact.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div className="doctor-contact-info">
                        <strong>{contact.name}</strong>
                        <span>
                          {contact.role === "patient"
                            ? "Patient"
                            : "Doctor"}
                        </span>
                      </div>

                      {unread && (
                        <span className="doctor-unread-dot" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="doctor-chat-panel">
            {!selectedContact ? (
              <div className="doctor-chat-empty">
                <div className="doctor-chat-empty-icon">
                  ◌
                </div>

                <h3>Select a conversation</h3>

                <p>
                  Choose a contact from the left to start messaging.
                </p>
              </div>
            ) : (
              <>
                <div className="doctor-chat-header">
                  <div className="doctor-chat-person">
                    <div className="doctor-chat-avatar">
                      {selectedContact.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <strong>{selectedContact.name}</strong>

                      <span>
                        {selectedContact.role === "patient"
                          ? "Patient"
                          : "Doctor"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="doctor-chat-messages">
                  {conversation.length === 0 ? (
                    <div className="doctor-no-messages">
                      No messages yet. Start the conversation.
                    </div>
                  ) : (
                    conversation.map((message) => {
                      const mine =
                        message.sender?._id === currentUser.id;

                      return (
                        <div
                          key={message._id}
                          className={`doctor-chat-message ${
                            mine ? "mine" : "received"
                          }`}
                        >
                          <div className="doctor-chat-bubble">
                            {message.subject && (
                              <strong>
                                {message.subject}
                              </strong>
                            )}

                            <p>{message.message}</p>

                            <small>
                              {new Date(
                                message.createdAt
                              ).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  className="doctor-chat-form"
                  onSubmit={sendMessage}
                >
                  <input
                    type="text"
                    placeholder="Subject (optional)"
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value)
                    }
                  />

                  <div className="doctor-message-compose">
                    <textarea
                      rows="2"
                      placeholder="Write a message..."
                      value={messageText}
                      onChange={(e) =>
                        setMessageText(e.target.value)
                      }
                    />

                    <button
                      type="submit"
                      disabled={sending || !messageText.trim()}
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </DoctorLayout>
  );
}

export default Messages;