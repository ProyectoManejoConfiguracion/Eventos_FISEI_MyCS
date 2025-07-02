import React, { useEffect, useState } from 'react';
import { Users, Calendar, Award, Globe, MapPin, Target, Eye, Heart, BookOpen, Building, GraduationCap, Phone, Mail } from 'lucide-react';
import '../../Styles/Contenido.css';
import Swal from 'sweetalert2';
import { BACK_URL } from '../../../config';

const MAIN_SECTIONS = [
  { key: 'home', label: 'Home' },
  { key: 'events', label: 'Eventos' },
  { key: 'about', label: 'Nosotros' },
  { key: 'contact', label: 'Contactos' }
];

const SECTION_OPTIONS = [
  { label: "Carrusel", value: "carousel" },
  { label: "Estadísticas", value: "stats" },
  { label: "Características", value: "feature" }
];

const ICON_OPTIONS = [
  { label: "Usuarios", value: "Users", icon: <Users size={22} /> },
  { label: "Calendario", value: "Calendar", icon: <Calendar size={22} /> },
  { label: "Premio", value: "Award", icon: <Award size={22} /> },
  { label: "Globo", value: "Globe", icon: <Globe size={22} /> },
  { label: "Ubicación", value: "MapPin", icon: <MapPin size={22} /> },
  { label: "Misión", value: "Target", icon: <Target size={22} /> },
  { label: "Visión", value: "Eye", icon: <Eye size={22} /> },
  { label: "Valores", value: "Heart", icon: <Heart size={22} /> },
  { label: "Libro", value: "BookOpen", icon: <BookOpen size={22} /> },
  { label: "Edificio", value: "Building", icon: <Building size={22} /> },
  { label: "Graduación", value: "GraduationCap", icon: <GraduationCap size={22} /> },
  { label: "Teléfono", value: "Phone", icon: <Phone size={22} /> },
  { label: "Correo", value: "Mail", icon: <Mail size={22} /> }
];

const ICON_MAP = {
  Users, Calendar, Award, Globe, MapPin, Target, Eye, Heart, BookOpen, Building, GraduationCap, Phone, Mail
};

const initialForm = {
  titulo: '',
  descripcion: '',
  imagen: null,
  section: 'carousel',
  icon: 'Users'
};

const NosotrosSections = [
  { key: "ImagenNosotros", label: "Imagen Principal" },
  { key: "tarjetasNosotros", label: "Tarjetas" },
  { key: "mensajeNosotros1", label: "Mensaje Principal" },
  { key: "autoridadesNosotros", label: "Autoridades" },
  { key: "mensajeNosotros2", label: "Mensaje Secundario" }
];

const initialTarjetaForm = { titulo: "", descripcion: "", icon: "Users" };
const initialAutoridadForm = { titulo: "", descripcion: "", imagen: null };

const ContactSections = [
  { key: "ImagenContactanos", label: "Imagen Principal" },
  { key: "tarjetasContactanos", label: "Tarjetas" }
];
const initialContactTarjetaForm = { titulo: "", descripcion: "", icon: "Phone" };

const Contenido = () => {
  const [activeSection, setActiveSection] = useState('home');

  // HOME
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeHomeSubsection, setActiveHomeSubsection] = useState('carousel');

  // EVENTOS 
  const [eventSectionData, setEventSectionData] = useState({
    id: null,
    titulo: '',
    descripcion: '',
    imagen: null,
    imagenUrl: null
  });
  const [eventSectionLoading, setEventSectionLoading] = useState(false);
  const [eventSectionError, setEventSectionError] = useState(null);
  const [eventSectionSuccess, setEventSectionSuccess] = useState(false);

  // ------------------ NOSOTROS ------------------
  const [aboutSection, setAboutSection] = useState(NosotrosSections[0].key);
  // Imagen Principal
  const [aboutImagenForm, setAboutImagenForm] = useState({ id: null, titulo: "", descripcion: "", imagen: null, imagenUrl: null });
  const [aboutImagenLoading, setAboutImagenLoading] = useState(false);
  const [aboutImagenSuccess, setAboutImagenSuccess] = useState(false);
  // Tarjetas
  const [tarjetas, setTarjetas] = useState([]);
  const [tarjetaForm, setTarjetaForm] = useState(initialTarjetaForm);
  const [tarjetaEditId, setTarjetaEditId] = useState(null);
  const [tarjetaSuccess, setTarjetaSuccess] = useState(false);
  const [tarjetaLoading, setTarjetaLoading] = useState(false);
  // Mensaje Principal
  const [msg1Form, setMsg1Form] = useState({ id: null, titulo: "", descripcion: "" });
  const [msg1Loading, setMsg1Loading] = useState(false);
  const [msg1Success, setMsg1Success] = useState(false);
  // Autoridades
  const [autoridades, setAutoridades] = useState([]);
  const [autoridadForm, setAutoridadForm] = useState(initialAutoridadForm);
  const [autoridadEditId, setAutoridadEditId] = useState(null);
  const [autoridadSuccess, setAutoridadSuccess] = useState(false);
  const [autoridadLoading, setAutoridadLoading] = useState(false);
  const [autoridadPreview, setAutoridadPreview] = useState(null);
  // Historia
  const [msg2Form, setMsg2Form] = useState({ id: null, titulo: "", descripcion: "", imagen: null, imagenUrl: null });
  const [msg2Loading, setMsg2Loading] = useState(false);
  const [msg2Success, setMsg2Success] = useState(false);

  // ------------------ CONTACTOS ------------------
  const [contactSection, setContactSection] = useState(ContactSections[0].key);
  // Imagen Principal
  const [contactImagenForm, setContactImagenForm] = useState({ id: null, titulo: "", descripcion: "", imagen: null, imagenUrl: null });
  const [contactImagenLoading, setContactImagenLoading] = useState(false);
  const [contactImagenSuccess, setContactImagenSuccess] = useState(false);
  // Tarjetas
  const [contactTarjetas, setContactTarjetas] = useState([]);
  const [contactTarjetaForm, setContactTarjetaForm] = useState(initialContactTarjetaForm);
  const [contactTarjetaEditId, setContactTarjetaEditId] = useState(null);
  const [contactTarjetaSuccess, setContactTarjetaSuccess] = useState(false);
  const [contactTarjetaLoading, setContactTarjetaLoading] = useState(false);

  // ========== DATA FETCHS ==========
  // HOME
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACK_URL}/api/home`);
      if (!res.ok) throw new Error('Error al cargar los datos');
      const d = await res.json();
      setData(Array.isArray(d) ? d : []);
    } catch (err) {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === 'home') fetchData();
  }, [activeSection]);

  // EVENTOS
  useEffect(() => {
    if (activeSection === 'events') {
      setEventSectionLoading(true);
      setEventSectionError(null);
      fetch(`${BACK_URL}/api/home?section=eventos`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const ev = data[0];
            setEventSectionData({
              id: ev.id,
              titulo: ev.titulo || '',
              descripcion: ev.descripcion || '',
              imagen: null,
              imagenUrl: ev.imagen ? `${BACK_URL}/${ev.imagen.replace(/\\/g, "/")}` : null
            });
          } else {
            setEventSectionData({
              id: null,
              titulo: '',
              descripcion: '',
              imagen: null,
              imagenUrl: null
            });
          }
        })
        .catch(() => setEventSectionError('No se pudo cargar la sección eventos'))
        .finally(() => setEventSectionLoading(false));
    }
  }, [activeSection]);

  // NOSOTROS
  useEffect(() => {
    if (activeSection !== 'about') return;
    // Imagen Principal
    if (aboutSection === "ImagenNosotros") {
      setAboutImagenLoading(true);
      fetch(`${BACK_URL}/api/home?section=ImagenNosotros`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const d = data[0];
            setAboutImagenForm({
              id: d.id,
              titulo: d.titulo || "",
              descripcion: d.descripcion || "",
              imagen: null,
              imagenUrl: d.imagen ? `${BACK_URL}/${d.imagen.replace(/\\/g, "/")}` : null
            });
          } else {
            setAboutImagenForm({ id: null, titulo: "", descripcion: "", imagen: null, imagenUrl: null });
          }
        })
        .finally(() => setAboutImagenLoading(false));
    }
    // Tarjetas
    if (aboutSection === "tarjetasNosotros") {
      setTarjetaLoading(true);
      fetch(`${BACK_URL}/api/home?section=tarjetasNosotros`)
        .then(res => res.json())
        .then(data => setTarjetas(Array.isArray(data) ? data : []))
        .finally(() => setTarjetaLoading(false));
    }
    // Mensaje principal
    if (aboutSection === "mensajeNosotros1") {
      setMsg1Loading(true);
      fetch(`${BACK_URL}/api/home?section=mensajeNosotros1`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setMsg1Form({ id: data[0].id, titulo: data[0].titulo || "", descripcion: data[0].descripcion || "" });
          } else {
            setMsg1Form({ id: null, titulo: "", descripcion: "" });
          }
        })
        .finally(() => setMsg1Loading(false));
    }
    // Autoridades
    if (aboutSection === "autoridadesNosotros") {
      setAutoridadLoading(true);
      fetch(`${BACK_URL}/api/home?section=autoridadesNosotros`)
        .then(res => res.json())
        .then(data => setAutoridades(Array.isArray(data) ? data : []))
        .finally(() => setAutoridadLoading(false));
    }
    // Historia
    if (aboutSection === "mensajeNosotros2") {
      setMsg2Loading(true);
      fetch(`${BACK_URL}/api/home?section=mensajeNosotros2`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const d = data[0];
            setMsg2Form({
              id: d.id,
              titulo: d.titulo || "",
              descripcion: d.descripcion || "",
              imagen: null,
              imagenUrl: d.imagen ? `${BACK_URL}/${d.imagen.replace(/\\/g, "/")}` : null
            });
          } else {
            setMsg2Form({ id: null, titulo: "", descripcion: "", imagen: null, imagenUrl: null });
          }
        })
        .finally(() => setMsg2Loading(false));
    }
  }, [activeSection, aboutSection]);

  // CONTACTOS
  useEffect(() => {
    if (activeSection !== 'contact') return;
    // Banner principal
    if (contactSection === "ImagenContactanos") {
      setContactImagenLoading(true);
      fetch(`${BACK_URL}/api/home?section=ImagenContactanos`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const d = data[0];
            setContactImagenForm({
              id: d.id,
              titulo: d.titulo || "",
              descripcion: d.descripcion || "",
              imagen: null,
              imagenUrl: d.imagen ? `${BACK_URL}/${d.imagen.replace(/\\/g, "/")}` : null
            });
          } else {
            setContactImagenForm({ id: null, titulo: "", descripcion: "", imagen: null, imagenUrl: null });
          }
        })
        .finally(() => setContactImagenLoading(false));
    }
    // Tarjetas
    if (contactSection === "tarjetasContactanos") {
      setContactTarjetaLoading(true);
      fetch(`${BACK_URL}/api/home?section=tarjetasContactanos`)
        .then(res => res.json())
        .then(data => setContactTarjetas(Array.isArray(data) ? data : []))
        .finally(() => setContactTarjetaLoading(false));
    }
  }, [activeSection, contactSection]);

  // ========== HOME HANDLERS ==========
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setForm(f => ({ ...f, imagen: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name === 'icon') {
      setForm(f => ({ ...f, icon: value || "Users" }));
    } else if (name === 'section') {
      setForm(f => ({ ...f, section: value, icon: value === "stats" ? "Users" : undefined }));
      setActiveHomeSubsection(value);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId && (typeof editingId !== "number" && isNaN(Number(editingId)))) {
      setError("Id inválido, no se puede editar.");
      return;
    }
    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('descripcion', form.descripcion);
    formData.append('section', form.section);
    if (form.section === "stats") {
      formData.append('imagen', form.icon || "Users");
    } else if (form.imagen) {
      formData.append('imagen', form.imagen);
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      let res;
      if (editingId) {
        res = await fetch(`${BACK_URL}/api/home/${editingId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        res = await fetch(`${BACK_URL}/api/home`, {
          method: 'POST',
          body: formData
        });
      }
      if (!res.ok) throw new Error("Error al guardar");
      setForm({ ...initialForm, section: activeHomeSubsection, icon: activeHomeSubsection === "stats" ? "Users" : undefined });
      setPreview(null);
      setEditingId(null);
      fetchData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Error al guardar los datos.');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACK_URL}/api/home/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchData();
      Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
    } catch {
      setError('Error al eliminar el contenido.');
      Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (item) => {
    if (!item.id || isNaN(Number(item.id))) {
      alert("Este registro tiene un id inválido y no puede ser editado.");
      return;
    }
    setEditingId(item.id);
    setForm({
      titulo: item.titulo || '',
      descripcion: item.descripcion || '',
      imagen: null,
      section: item.section || 'carousel',
      icon: item.section === "stats" ? (item.imagen || "Users") : undefined
    });
    setPreview(
      item.section === "stats"
        ? null
        : (item.imagen ? `${BACK_URL}/${item.imagen}` : null)
    );
    setActiveHomeSubsection(item.section || 'carousel');
  };
  const handleCancel = () => {
    setForm({ ...initialForm, section: activeHomeSubsection, icon: activeHomeSubsection === "stats" ? "Users" : undefined });
    setEditingId(null);
    setPreview(null);
  };
  const filteredData = data.filter(item =>
    item.section === activeHomeSubsection && !isNaN(Number(item.id))
  );

  // ========== EVENTO HERO ==========
  const handleEventSectionChange = (e) => {
    const { name, value } = e.target;
    setEventSectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEventSectionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventSectionData(prev => ({
        ...prev,
        imagen: file,
        imagenUrl: URL.createObjectURL(file)
      }));
    }
  };
  const handleEventSectionSubmit = async (e) => {
    e.preventDefault();
    setEventSectionLoading(true);
    setEventSectionError(null);
    setEventSectionSuccess(false);
    try {
      const fd = new FormData();
      fd.append('titulo', eventSectionData.titulo);
      fd.append('descripcion', eventSectionData.descripcion);
      if (eventSectionData.imagen) fd.append('imagen', eventSectionData.imagen);
      fd.append('section', 'eventos');
      let url = `${BACK_URL}/api/home`;
      let method = 'POST';
      if (eventSectionData.id) {
        url = `${BACK_URL}/api/home/${eventSectionData.id}`;
        method = 'PUT';
      }
      const res = await fetch(url, {
        method,
        body: fd
      });
      if (!res.ok) throw new Error('Error al actualizar la sección');
      setEventSectionSuccess(true);
      setTimeout(() => setEventSectionSuccess(false), 2000);
      const result = await res.json();
      setEventSectionData(prev => ({
        ...prev,
        imagen: null,
        imagenUrl: result.imagen ? `${BACK_URL}/${result.imagen.replace(/\\/g, "/")}` : prev.imagenUrl
      }));
    } catch (err) {
      setEventSectionError(err.message);
    } finally {
      setEventSectionLoading(false);
    }
  };

  // ========== NOSOTROS HANDLERS ==========
  const handleAboutImagenChange = e => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files?.[0]) {
      setAboutImagenForm(f => ({ ...f, imagen: files[0], imagenUrl: URL.createObjectURL(files[0]) }));
    } else {
      setAboutImagenForm(f => ({ ...f, [name]: value }));
    }
  };
  const submitAboutImagen = async e => {
    e.preventDefault();
    setAboutImagenLoading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", aboutImagenForm.titulo);
      fd.append("descripcion", aboutImagenForm.descripcion);
      if (aboutImagenForm.imagen) fd.append("imagen", aboutImagenForm.imagen);
      fd.append("section", "ImagenNosotros");
      let url = `${BACK_URL}/api/home`;
      let method = 'POST';
      if (aboutImagenForm.id) {
        url = `${BACK_URL}/api/home/${aboutImagenForm.id}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar la imagen principal");
      setAboutImagenSuccess(true);
      setTimeout(() => setAboutImagenSuccess(false), 2000);
      setAboutImagenForm(f => ({ ...f, imagen: null }));
      setAboutSection("ImagenNosotros");
    } catch (error) {
      console.error("Error al guardar imagen principal:", error);
    } finally {
      setAboutImagenLoading(false);
    }
  };
  // Tarjetas Nosotros
  const handleTarjetaChange = e => {
    const { name, value } = e.target;
    setTarjetaForm(f => ({ ...f, [name]: value }));
  };
  const handleTarjetaEdit = tarjeta => {
    setTarjetaForm({
      titulo: tarjeta.titulo,
      descripcion: tarjeta.descripcion,
      icon: tarjeta.imagen || "Users"
    });
    setTarjetaEditId(tarjeta.id);
  };
  const handleTarjetaCancel = () => {
    setTarjetaForm(initialTarjetaForm);
    setTarjetaEditId(null);
  };
  const submitTarjeta = async e => {
    e.preventDefault();
    setTarjetaLoading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", tarjetaForm.titulo);
      fd.append("descripcion", tarjetaForm.descripcion);
      fd.append("imagen", tarjetaForm.icon);
      fd.append("section", "tarjetasNosotros");
      let url = `${BACK_URL}/api/home`;
      let method = "POST";
      if (tarjetaEditId) {
        url = `${BACK_URL}/api/home/${tarjetaEditId}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar la tarjeta");
      setTarjetaSuccess(true);
      setTimeout(() => setTarjetaSuccess(false), 2000);
      setTarjetaForm(initialTarjetaForm);
      setTarjetaEditId(null);
      setAboutSection("tarjetasNosotros");
    } catch (error) {
      console.error("Error al guardar tarjeta:", error);
    } finally {
      setTarjetaLoading(false);
    }
  };
  const deleteTarjeta = async id => {
    const result = await Swal.fire({
      title: '¿Eliminar tarjeta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    setTarjetaLoading(true);
    try {
      await fetch(`${BACK_URL}/api/home/${id}`, { method: "DELETE" });
      setAboutSection("tarjetasNosotros");
      Swal.fire('¡Eliminado!', 'La tarjeta ha sido eliminada.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la tarjeta.', 'error');
    } finally {
      setTarjetaLoading(false);
    }
  };
  // Mensaje Principal
  const handleMsg1Change = e => {
    const { name, value } = e.target;
    setMsg1Form(f => ({ ...f, [name]: value }));
  };
  const submitMsg1 = async e => {
    e.preventDefault();
    setMsg1Loading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", msg1Form.titulo);
      fd.append("descripcion", msg1Form.descripcion);
      fd.append("section", "mensajeNosotros1");
      let url = `${BACK_URL}/api/home`;
      let method = "POST";
      if (msg1Form.id) {
        url = `${BACK_URL}/api/home/${msg1Form.id}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar el mensaje principal");
      setMsg1Success(true);
      setTimeout(() => setMsg1Success(false), 2000);
      setAboutSection("mensajeNosotros1");
    } catch (error) {
      console.error("Error al guardar mensaje principal:", error);
    } finally {
      setMsg1Loading(false);
    }
  };
  // Autoridades
  const handleAutoridadChange = e => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files?.[0]) {
      setAutoridadForm(f => ({ ...f, imagen: files[0] }));
      setAutoridadPreview(URL.createObjectURL(files[0]));
    } else {
      setAutoridadForm(f => ({ ...f, [name]: value }));
    }
  };
  const handleAutoridadEdit = a => {
    setAutoridadForm({ titulo: a.titulo, descripcion: a.descripcion, imagen: null });
    setAutoridadEditId(a.id);
    setAutoridadPreview(a.imagen ? `${BACK_URL}/${a.imagen.replace(/\\/g, "/")}` : null);
  };
  const handleAutoridadCancel = () => {
    setAutoridadForm(initialAutoridadForm);
    setAutoridadEditId(null);
    setAutoridadPreview(null);
  };
  const submitAutoridad = async e => {
    e.preventDefault();
    setAutoridadLoading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", autoridadForm.titulo);
      fd.append("descripcion", autoridadForm.descripcion);
      fd.append("section", "autoridadesNosotros");
      if (autoridadForm.imagen) fd.append("imagen", autoridadForm.imagen);
      let url = `${BACK_URL}/api/home`;
      let method = "POST";
      if (autoridadEditId) {
        url = `${BACK_URL}/api/home/${autoridadEditId}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar la autoridad");
      setAutoridadSuccess(true);
      setTimeout(() => setAutoridadSuccess(false), 2000);
      setAutoridadForm(initialAutoridadForm);
      setAutoridadEditId(null);
      setAutoridadPreview(null);
      setAboutSection("autoridadesNosotros");
    } catch (error) {
      console.error("Error al guardar autoridad:", error);
    } finally {
      setAutoridadLoading(false);
    }
  };
  const deleteAutoridad = async id => {
    const result = await Swal.fire({
      title: '¿Eliminar autoridad?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    setAutoridadLoading(true);
    try {
      await fetch(`${BACK_URL}/api/home/${id}`, { method: "DELETE" });
      setAboutSection("autoridadesNosotros");
      Swal.fire('¡Eliminado!', 'La autoridad ha sido eliminada.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la autoridad.', 'error');
    } finally {
      setAutoridadLoading(false);
    }
  };
  // Historia
  const handleMsg2Change = e => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files?.[0]) {
      setMsg2Form(f => ({ ...f, imagen: files[0], imagenUrl: URL.createObjectURL(files[0]) }));
    } else {
      setMsg2Form(f => ({ ...f, [name]: value }));
    }
  };
  const submitMsg2 = async e => {
    e.preventDefault();
    setMsg2Loading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", msg2Form.titulo);
      fd.append("descripcion", msg2Form.descripcion);
      if (msg2Form.imagen) fd.append("imagen", msg2Form.imagen);
      fd.append("section", "mensajeNosotros2");
      let url = `${BACK_URL}/api/home`;
      let method = "POST";
      if (msg2Form.id) {
        url = `${BACK_URL}/api/home/${msg2Form.id}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar la historia");
      setMsg2Success(true);
      setTimeout(() => setMsg2Success(false), 2000);
      setMsg2Form(f => ({ ...f, imagen: null }));
      setAboutSection("mensajeNosotros2");
    } catch (error) {
      console.error("Error al guardar historia:", error);
    } finally {
      setMsg2Loading(false);
    }
  };

  // ========== CONTACTOS HANDLERS ==========
  // Imagen principal
  const handleContactImagenChange = e => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files?.[0]) {
      setContactImagenForm(f => ({ ...f, imagen: files[0], imagenUrl: URL.createObjectURL(files[0]) }));
    } else {
      setContactImagenForm(f => ({ ...f, [name]: value }));
    }
  };
  const submitContactImagen = async e => {
    e.preventDefault();
    setContactImagenLoading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", contactImagenForm.titulo);
      fd.append("descripcion", contactImagenForm.descripcion);
      if (contactImagenForm.imagen) fd.append("imagen", contactImagenForm.imagen);
      fd.append("section", "ImagenContactanos");
      let url = `${BACK_URL}/api/home`;
      let method = 'POST';
      if (contactImagenForm.id) {
        url = `${BACK_URL}/api/home/${contactImagenForm.id}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar la imagen de contactos");
      setContactImagenSuccess(true);
      setTimeout(() => setContactImagenSuccess(false), 2000);
      setContactImagenForm(f => ({ ...f, imagen: null }));
      setContactSection("ImagenContactanos");
    } catch (error) {
      console.error("Error al guardar imagen de contactos:", error);
    } finally {
      setContactImagenLoading(false);
    }
  };
  // Tarjetas contacto
  const handleContactTarjetaChange = e => {
    const { name, value } = e.target;
    setContactTarjetaForm(f => ({ ...f, [name]: value }));
  };
  const handleContactTarjetaEdit = tarjeta => {
    setContactTarjetaForm({
      titulo: tarjeta.titulo,
      descripcion: tarjeta.descripcion,
      icon: isIconName(tarjeta.imagen) ? tarjeta.imagen : "Phone"
    });
    setContactTarjetaEditId(tarjeta.id);
  };
  const handleContactTarjetaCancel = () => {
    setContactTarjetaForm(initialContactTarjetaForm);
    setContactTarjetaEditId(null);
  };
  const reloadContactTarjetas = () => {
    fetch(`${BACK_URL}/api/home?section=tarjetasContactanos`)
      .then(res => res.json())
      .then(data => setContactTarjetas(Array.isArray(data) ? data : []));
  };
  const submitContactTarjeta = async e => {
    e.preventDefault();
    setContactTarjetaLoading(true);
    try {
      const fd = new FormData();
      fd.append("titulo", contactTarjetaForm.titulo);
      fd.append("descripcion", contactTarjetaForm.descripcion);
      fd.append("imagen", contactTarjetaForm.icon);
      fd.append("section", "tarjetasContactanos");
      let url = `${BACK_URL}/api/home`;
      let method = "POST";
      if (contactTarjetaEditId) {
        url = `${BACK_URL}/api/home/${contactTarjetaEditId}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Error al guardar la tarjeta de contactos");
      setContactTarjetaSuccess(true);
      setTimeout(() => setContactTarjetaSuccess(false), 2000);
      setContactTarjetaForm(initialContactTarjetaForm);
      setContactTarjetaEditId(null);
      reloadContactTarjetas();
    } catch (error) {
      console.error("Error al guardar tarjeta de contactos:", error);
    } finally {
      setContactTarjetaLoading(false);
    }
  };

  const deleteContactTarjeta = async id => {
    const result = await Swal.fire({
      title: '¿Eliminar esta tarjeta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    setContactTarjetaLoading(true);
    try {
      await fetch(`${BACK_URL}/api/home/${id}`, { method: "DELETE" });
      reloadContactTarjetas();
      Swal.fire('¡Eliminado!', 'La tarjeta ha sido eliminada.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la tarjeta.', 'error');
    } finally {
      setContactTarjetaLoading(false);
    }
  };
  const isIconName = (imageValue) => {
    return Object.prototype.hasOwnProperty.call(ICON_MAP, imageValue);
  };

  // ========== RENDER ==========
  return (
    <main className="main-content">
      <div className="contenido-container">
        <h1>Editor de Contenido Web</h1>
        <div className="content-sections-tabs">
          {MAIN_SECTIONS.map(section => (
            <button
              key={section.key}
              className={activeSection === section.key ? 'active' : ''}
              onClick={() => setActiveSection(section.key)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </div>
        {/* Mensajes de estado */}
        {activeSection === 'home' && loading && <div className="loading">Cargando contenido...</div>}
        {activeSection === 'home' && error && <div className="error">{error}</div>}
        {activeSection === 'home' && success && <div className="success-message">¡Contenido actualizado exitosamente!</div>}

        {/* ======================== HOME ======================== */}
        {activeSection === 'home' && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div className="content-sections-tabs" style={{ border: 0, marginBottom: 8, gap: 6 }}>
                {SECTION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={activeHomeSubsection === opt.value ? 'active' : ''}
                    onClick={() => {
                      setActiveHomeSubsection(opt.value);
                      setForm({ ...initialForm, section: opt.value, icon: opt.value === "stats" ? "Users" : undefined });
                      setEditingId(null);
                      setPreview(null);
                    }}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <form className="contenido-form" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Título</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Sección</label>
                <select name="section" value={form.section} onChange={handleChange} required style={{ padding: "6px 12px", borderRadius: 6, minWidth: 160 }}>
                  {SECTION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {form.section === "stats" && (
                <div className="form-group">
                  <label>Ícono (para Estadísticas)</label>
                  <select name="icon" value={form.icon || "Users"} onChange={handleChange} style={{ padding: "6px 12px", borderRadius: 6, minWidth: 160 }}>
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div style={{ marginTop: 5 }}>
                    {ICON_OPTIONS.find(opt => opt.value === (form.icon || "Users"))?.icon}
                  </div>
                </div>
              )}
              {form.section !== "stats" && (
                <div className="form-group">
                  <label>Imagen</label>
                  <div className="file-input-container">
                    <label className="file-input-button">
                      Seleccionar imagen
                      <input
                        type="file"
                        name="imagen"
                        accept="image/*"
                        className="file-input-hidden"
                        onChange={handleChange}
                      />
                    </label>
                    {form.imagen && (
                      <span className="file-name">{form.imagen.name}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                    Formatos aceptados: JPG, PNG. Máximo 2MB.
                  </div>
                  {preview && (
                    <div className="image-preview">
                      <img src={preview} alt="preview" className="preview-image" />
                    </div>
                  )}
                </div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-btn">{editingId ? "Guardar cambios" : "Agregar"}</button>
                {editingId && <button type="button" onClick={handleCancel} className="cancel-btn">Cancelar</button>}
              </div>
            </form>
            {/* Tabla */}
            <h3 style={{ marginTop: 32, fontSize: 22, fontWeight: 600, color: "#581517" }}>
              {SECTION_OPTIONS.find(opt => opt.value === activeHomeSubsection)?.label || ""} (sección)
            </h3>
            {loading && <div>Cargando...</div>}
            {filteredData.length === 0 && !loading && <div>No hay registros para esta sección.</div>}
            <div style={{ overflowX: "auto" }}>
              <table className="contenido-table" style={{ width: "100%", background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px #0001", marginTop: 16 }}>
                <thead style={{ background: "#faf8fa" }}>
                  <tr>
                    <th style={{ padding: "12px 14px" }}>Título</th>
                    <th style={{ padding: "12px 14px" }}>Descripción</th>
                    {activeHomeSubsection === "stats"
                      ? <th style={{ padding: "12px 14px" }}>Ícono</th>
                      : <th style={{ padding: "12px 14px" }}>Imagen</th>
                    }
                    <th style={{ padding: "12px 14px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: "12px 14px" }}>{item.titulo}</td>
                      <td style={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "12px 14px" }}>{item.descripcion}</td>
                      <td style={{ padding: "12px 14px" }}>
                        {activeHomeSubsection === "stats" ? (
                          (() => {
                            const Icon = ICON_MAP[item.imagen || "Users"] || Users;
                            return <Icon size={28} />;
                          })()
                        ) : (
                          item.imagen && (
                            <img src={`${BACK_URL}/${item.imagen}`} alt="" style={{ maxWidth: 80, maxHeight: 50, borderRadius: 6 }} />
                          )
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button onClick={() => handleEdit(item)} style={{
                          marginRight: 6, background: "#581517", color: "white", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                        }}>Editar</button>
                        <button onClick={() => handleDelete(item.id)} style={{
                          color: '#fff', background: "#e74c3c", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                        }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======================== EVENTOS ======================== */}
        {activeSection === 'events' && (
          <form className="contenido-form" onSubmit={handleEventSectionSubmit}>
            <div className="form-section">
              <h2>Sección Hero de Eventos</h2>
              <div className="form-group">
                <label>Título</label>
                <input type="text" name="titulo" value={eventSectionData.titulo} onChange={handleEventSectionChange} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={eventSectionData.descripcion} onChange={handleEventSectionChange} required />
              </div>
              <div className="form-group">
                <label>Imagen Hero (1920x1080px recomendado)</label>
                <div className="file-input-container">
                  <label className="file-input-button">
                    Seleccionar imagen
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input-hidden"
                      onChange={handleEventSectionImageChange}
                    />
                  </label>
                  {eventSectionData.imagen && (
                    <span className="file-name">{eventSectionData.imagen.name}</span>
                  )}
                </div>
                {eventSectionData.imagenUrl && (
                  <div className="image-preview">
                    <img src={eventSectionData.imagenUrl} alt="Previsualización" className="preview-image" />
                  </div>
                )}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={eventSectionLoading} className="submit-btn">
                {eventSectionLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
            {eventSectionError && <div className="error">{eventSectionError}</div>}
            {eventSectionSuccess && <div className="success-message">¡Sección eventos actualizada!</div>}
          </form>
        )}

        {/* ======================== NOSOTROS ======================== */}
        {activeSection === 'about' && (
          <>
            <div className="content-sections-tabs" style={{ border: 0, marginBottom: 32, gap: 6 }}>
              {NosotrosSections.map(opt => (
                <button
                  key={opt.key}
                  className={aboutSection === opt.key ? 'active' : ''}
                  onClick={() => setAboutSection(opt.key)}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Imagen Principal */}
            {aboutSection === "ImagenNosotros" && (
              <form className="contenido-form" onSubmit={submitAboutImagen}>
                <div className="form-section">
                  <h2>Imagen Principal</h2>
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={aboutImagenForm.titulo} onChange={handleAboutImagenChange} required />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={aboutImagenForm.descripcion} onChange={handleAboutImagenChange} required />
                  </div>
                  <div className="form-group">
                    <label>Imagen Principal</label>
                    <div className="file-input-container">
                      <label className="file-input-button">
                        Seleccionar imagen
                        <input
                          type="file"
                          name="imagen"
                          accept="image/*"
                          className="file-input-hidden"
                          onChange={handleAboutImagenChange}
                        />
                      </label>
                      {aboutImagenForm.imagen && (
                        <span className="file-name">{aboutImagenForm.imagen.name}</span>
                      )}
                    </div>
                    {aboutImagenForm.imagenUrl && (
                      <div className="image-preview">
                        <img src={aboutImagenForm.imagenUrl} alt="preview" className="preview-image" />
                      </div>
                    )}
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={aboutImagenLoading}>
                      {aboutImagenLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                  {aboutImagenSuccess && <div className="success-message">¡Actualizado!</div>}
                </div>
              </form>
            )}
            {/* Tarjetas Nosotros */}
            {aboutSection === "tarjetasNosotros" && (
              <>
                <form className="contenido-form" onSubmit={submitTarjeta}>
                  <div className="form-section">
                    <h2>Tarjeta (Icono) - Nosotros</h2>
                    <div className="form-group">
                      <label>Título</label>
                      <input type="text" name="titulo" value={tarjetaForm.titulo} onChange={handleTarjetaChange} required />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea name="descripcion" value={tarjetaForm.descripcion} onChange={handleTarjetaChange} required />
                    </div>
                    <div className="form-group">
                      <label>Icono</label>
                      <select name="icon" value={tarjetaForm.icon} onChange={handleTarjetaChange} required>
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 5 }}>
                        {ICON_OPTIONS.find(opt => opt.value === tarjetaForm.icon)?.icon}
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="submit-btn" disabled={tarjetaLoading}>
                        {tarjetaEditId ? "Guardar cambios" : "Agregar"}
                      </button>
                      {tarjetaEditId && <button type="button" onClick={handleTarjetaCancel} className="cancel-btn">Cancelar</button>}
                    </div>
                    {tarjetaSuccess && <div className="success-message">¡Guardado!</div>}
                  </div>
                </form>
                <h3 style={{ marginTop: 32, fontSize: 22, fontWeight: 600, color: "#581517" }}>Tarjetas de Nosotros</h3>
                <div style={{ overflowX: "auto" }}>
                  <table className="contenido-table" style={{ width: "100%", background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px #0001", marginTop: 16 }}>
                    <thead style={{ background: "#faf8fa" }}>
                      <tr>
                        <th style={{ padding: "12px 14px" }}>Título</th>
                        <th style={{ padding: "12px 14px" }}>Descripción</th>
                        <th style={{ padding: "12px 14px" }}>Icono</th>
                        <th style={{ padding: "12px 14px" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tarjetas.map(t => (
                        <tr key={t.id}>
                          <td style={{ padding: "12px 14px" }}>{t.titulo}</td>
                          <td style={{ padding: "12px 14px" }}>{t.descripcion}</td>
                          <td style={{ padding: "12px 14px" }}>
                            {(() => {
                              const Icon = ICON_MAP[t.imagen] || Users;
                              return <Icon size={28} />;
                            })()}
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <button onClick={() => handleTarjetaEdit(t)} style={{
                              marginRight: 6, background: "#581517", color: "white", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                            }}>Editar</button>
                            <button onClick={() => deleteTarjeta(t.id)} style={{
                              color: '#fff', background: "#e74c3c", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                            }}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {/* Mensaje Principal */}
            {aboutSection === "mensajeNosotros1" && (
              <form className="contenido-form" onSubmit={submitMsg1}>
                <div className="form-section">
                  <h2>Mensaje Principal</h2>
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={msg1Form.titulo} onChange={handleMsg1Change} required />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={msg1Form.descripcion} onChange={handleMsg1Change} required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={msg1Loading}>Guardar Cambios</button>
                  </div>
                  {msg1Success && <div className="success-message">¡Guardado!</div>}
                </div>
              </form>
            )}
            {/* Autoridades */}
            {aboutSection === "autoridadesNosotros" && (
              <>
                <form className="contenido-form" onSubmit={submitAutoridad} encType="multipart/form-data">
                  <div className="form-section">
                    <h2>Autoridad</h2>
                    <div className="form-group">
                      <label>Cargo (Título)</label>
                      <input type="text" name="titulo" value={autoridadForm.titulo} onChange={handleAutoridadChange} required />
                    </div>
                    <div className="form-group">
                      <label>Nombre (Descripción)</label>
                      <input type="text" name="descripcion" value={autoridadForm.descripcion} onChange={handleAutoridadChange} required />
                    </div>
                    <div className="form-group">
                      <label>Imagen</label>
                      <div className="file-input-container">
                        <label className="file-input-button">
                          Seleccionar imagen
                          <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            className="file-input-hidden"
                            onChange={handleAutoridadChange}
                          />
                        </label>
                        {autoridadForm.imagen && (
                          <span className="file-name">{autoridadForm.imagen.name}</span>
                        )}
                      </div>
                      {autoridadPreview && (
                        <div className="image-preview">
                          <img src={autoridadPreview} alt="preview" className="preview-image" />
                        </div>
                      )}
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="submit-btn" disabled={autoridadLoading}>
                        {autoridadEditId ? "Guardar cambios" : "Agregar"}
                      </button>
                      {autoridadEditId && <button type="button" onClick={handleAutoridadCancel} className="cancel-btn">Cancelar</button>}
                    </div>
                    {autoridadSuccess && <div className="success-message">¡Guardado!</div>}
                  </div>
                </form>
                <h3 style={{ marginTop: 32, fontSize: 22, fontWeight: 600, color: "#581517" }}>Autoridades</h3>
                <div style={{ overflowX: "auto" }}>
                  <table className="contenido-table" style={{ width: "100%", background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px #0001", marginTop: 16 }}>
                    <thead style={{ background: "#faf8fa" }}>
                      <tr>
                        <th style={{ padding: "12px 14px" }}>Cargo</th>
                        <th style={{ padding: "12px 14px" }}>Nombre</th>
                        <th style={{ padding: "12px 14px" }}>Imagen</th>
                        <th style={{ padding: "12px 14px" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {autoridades.map(a => (
                        <tr key={a.id}>
                          <td style={{ padding: "12px 14px" }}>{a.titulo}</td>
                          <td style={{ padding: "12px 14px" }}>{a.descripcion}</td>
                          <td style={{ padding: "12px 14px" }}>
                            {a.imagen &&
                              <img src={`${BACK_URL}/${a.imagen.replace(/\\/g, "/")}`} alt={a.descripcion} style={{ width: 56, height: 80, borderRadius: "10%", objectFit: "cover" }} />
                            }
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <button onClick={() => handleAutoridadEdit(a)} style={{
                              marginRight: 6, background: "#581517", color: "white", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                            }}>Editar</button>
                            <button onClick={() => deleteAutoridad(a.id)} style={{
                              color: '#fff', background: "#e74c3c", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                            }}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {/* Historia */}
            {aboutSection === "mensajeNosotros2" && (
              <form className="contenido-form" onSubmit={submitMsg2} encType="multipart/form-data">
                <div className="form-section">
                  <h2>Historia</h2>
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={msg2Form.titulo} onChange={handleMsg2Change} required />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={msg2Form.descripcion} onChange={handleMsg2Change} required />
                  </div>
                  <div className="form-group">
                    <label>Imagen</label>
                    <div className="file-input-container">
                      <label className="file-input-button">
                        Seleccionar imagen
                        <input
                          type="file"
                          name="imagen"
                          accept="image/*"
                          className="file-input-hidden"
                          onChange={handleMsg2Change}
                        />
                      </label>
                      {msg2Form.imagen && (
                        <span className="file-name">{msg2Form.imagen.name}</span>
                      )}
                    </div>
                    {msg2Form.imagenUrl && (
                      <div className="image-preview">
                        <img src={msg2Form.imagenUrl} alt="preview" className="preview-image" />
                      </div>
                    )}
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={msg2Loading}>Guardar Cambios</button>
                  </div>
                  {msg2Success && <div className="success-message">¡Guardado!</div>}
                </div>
              </form>
            )}
          </>
        )}

        {/* ======================== CONTACTOS ======================== */}
        {activeSection === 'contact' && (
          <>
            <div className="content-sections-tabs" style={{ border: 0, marginBottom: 32, gap: 6 }}>
              {ContactSections.map(opt => (
                <button
                  key={opt.key}
                  className={contactSection === opt.key ? 'active' : ''}
                  onClick={() => setContactSection(opt.key)}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Imagen Principal */}
            {contactSection === "ImagenContactanos" && (
              <form className="contenido-form" onSubmit={submitContactImagen}>
                <div className="form-section">
                  <h2>Imagen Principal</h2>
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={contactImagenForm.titulo} onChange={handleContactImagenChange} required />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={contactImagenForm.descripcion} onChange={handleContactImagenChange} required />
                  </div>
                  <div className="form-group">
                    <label>Imagen Principal</label>
                    <div className="file-input-container">
                      <label className="file-input-button">
                        Seleccionar imagen
                        <input
                          type="file"
                          name="imagen"
                          accept="image/*"
                          className="file-input-hidden"
                          onChange={handleContactImagenChange}
                        />
                      </label>
                      {contactImagenForm.imagen && (
                        <span className="file-name">{contactImagenForm.imagen.name}</span>
                      )}
                    </div>
                    {contactImagenForm.imagenUrl && (
                      <div className="image-preview">
                        <img src={contactImagenForm.imagenUrl} alt="preview" className="preview-image" />
                      </div>
                    )}
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={contactImagenLoading}>
                      {contactImagenLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                  {contactImagenSuccess && <div className="success-message">¡Actualizado!</div>}
                </div>
              </form>
            )}
            {/* Tarjetas Contactos */}
            {contactSection === "tarjetasContactanos" && (
              <>
                <form className="contenido-form" onSubmit={submitContactTarjeta}>
                  <div className="form-section">
                    <h2>Tarjeta de Contacto</h2>
                    <div className="form-group">
                      <label>Título</label>
                      <input type="text" name="titulo" value={contactTarjetaForm.titulo} onChange={handleContactTarjetaChange} required />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea name="descripcion" value={contactTarjetaForm.descripcion} onChange={handleContactTarjetaChange} required />
                    </div>
                    <div className="form-group">
                      <label>Icono</label>
                      <select name="icon" value={contactTarjetaForm.icon} onChange={handleContactTarjetaChange} required>
                        {["Phone", "Mail", "MapPin"].map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 5 }}>
                        {ICON_MAP[contactTarjetaForm.icon] && React.createElement(ICON_MAP[contactTarjetaForm.icon], { size: 28 })}
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="submit-btn" disabled={contactTarjetaLoading}>
                        {contactTarjetaEditId ? "Guardar cambios" : "Agregar"}
                      </button>
                      {contactTarjetaEditId && <button type="button" onClick={handleContactTarjetaCancel} className="cancel-btn">Cancelar</button>}
                    </div>
                    {contactTarjetaSuccess && <div className="success-message">¡Guardado!</div>}
                  </div>
                </form>
                <h3 style={{ marginTop: 32, fontSize: 22, fontWeight: 600, color: "#581517" }}>Tarjetas de Contacto</h3>
                <div style={{ overflowX: "auto" }}>
                  <table className="contenido-table" style={{ width: "100%", background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px #0001", marginTop: 16 }}>
                    <thead style={{ background: "#faf8fa" }}>
                      <tr>
                        <th style={{ padding: "12px 14px" }}>Título</th>
                        <th style={{ padding: "12px 14px" }}>Descripción</th>
                        <th style={{ padding: "12px 14px" }}>Icono</th>
                        <th style={{ padding: "12px 14px" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactTarjetas.map(t => (
                        <tr key={t.id}>
                          <td style={{ padding: "12px 14px" }}>{t.titulo}</td>
                          <td style={{ padding: "12px 14px" }}>{t.descripcion}</td>
                          <td style={{ padding: "12px 14px" }}>
                            {isIconName(t.imagen) && React.createElement(ICON_MAP[t.imagen], { size: 28 })}
                            {!isIconName(t.imagen) && t.imagen && <span style={{ color: 'red' }}>Icono inválido</span>}
                            {!isIconName(t.imagen) && !t.imagen && <span style={{ color: 'red' }}>Sin icono</span>}
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <button onClick={() => handleContactTarjetaEdit(t)} style={{
                              marginRight: 6, background: "#581517", color: "white", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                            }}>Editar</button>
                            <button onClick={() => deleteContactTarjeta(t.id)} style={{
                              color: '#fff', background: "#e74c3c", border: 0, borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer"
                            }}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Contenido;