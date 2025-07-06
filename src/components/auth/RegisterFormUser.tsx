// src/components/auth/RegisterForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface PersonalInfo {
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: string;
  universidad: string;
  carrera: string;
  ciclo: string;
  departamento: string;
}

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { registerUser } = useAuth();

  // Paso 1: Información de acceso
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (value: string) => {
    setEmail(value);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError("Ingresa un correo válido");
      setIsEmailValid(false);
    } else {
      setError("");
      setIsEmailValid(true);
    }
  };

  // Paso 2: Información personal
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    nombres: "",
    apellidos: "",
    edad: 0,
    sexo: "",
    universidad: "",
    carrera: "",
    ciclo: "",
    departamento: "",
  });

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: name === "edad" ? parseInt(value) || 0 : value,
    }));
  };

  const validateStep1 = () => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    console.log("handleNextStep called, current step:", step);
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setError("");
    setLoading(true);

    try {
      // Registrar usuario y esperar a que complete
      await registerUser(email, password, "6BM5IWJH", personalInfo);

      // Redirigir después de una breve espera (1 segundo es suficiente)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/user");
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-mi-color-rgb flex flex-col items-center justify-center p-4">
      <div className="bg-celeste p-8 rounded-lg shadow-md w-full max-w-md mx-auto my-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Registro de Usuario
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex justify-center">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-500"
              }`}
            >
              1
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-500"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <form className="space-y-4">
          {step === 1 ? (
            <>
              {/*
              <div>
                <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Invitación
                </label>
                <input
                  id="invitationCode"
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nombres"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombres
                  </label>
                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    value={personalInfo.nombres}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="apellidos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    value={personalInfo.apellidos}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edad"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Edad
                  </label>
                  <input
                    id="edad"
                    name="edad"
                    type="number"
                    value={personalInfo.edad || ""}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="sexo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sexo
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    value={personalInfo.sexo}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="Varón">Varón</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="universidad"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Universidad
                </label>
                <input
                  id="universidad"
                  name="universidad"
                  type="text"
                  value={personalInfo.universidad}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="carrera"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Carrera
                </label>
                <input
                  id="carrera"
                  name="carrera"
                  type="text"
                  value={personalInfo.carrera}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="ciclo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ciclo
                </label>
                <input
                  id="ciclo"
                  name="ciclo"
                  type="text"
                  value={personalInfo.ciclo}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="departamento"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departamento
                </label>
                <input
                  id="departamento"
                  name="departamento"
                  type="text"
                  value={personalInfo.departamento}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Anterior
              </button>
            )}
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isEmailValid}
                className={`w-full py-2 px-4 rounded-md transition 
                            ${
                              isEmailValid
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
