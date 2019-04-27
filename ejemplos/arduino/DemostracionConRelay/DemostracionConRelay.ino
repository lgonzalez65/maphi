/* 
 * MovimientoStep_2d:  
 * 1. Recoge semillas
 * 2. Mueve el motor 1 (X) j*710 pasos hacia delante a velocidad 200 pulsos/s (pps)
 * 3. Deposita semillas
 * 4. Mueve el motor 1 (X) j*710 pasos hacia atrás a velocidad 200 pulsos/s (pps)
 * Con cada paso se aumenta la distancia en incrementos de 50 pulsos, mediante el índice j.
 * Al cabo de 2 vueltas se reinicia el ciclo.
 * Añade interrupción (0) proveniente de PIN2 (activa baja) para fin de carrera eje X [limiteX()]
 * LGA, 25/06/2018
 * EGG, 28/06/2018 Integración del Relay para activar la succión
 */
 
// Declaracion Variables
  const int Pin_succion = 7; // Relay que activa la succion 
  const int Pin_enable = 8; // Salida /EN: activo bajo 
  const int Pin_stepX = 9; // Salida STEPX 
  const int Pin_dirX = 10;  // Salida DIRX
  const int Pin_stepY = 11; //Salida STEPY
  const int Pin_dirY = 12;  // Salida DIRY
  const boolean adelante = HIGH;
  const boolean atras = LOW;
  const boolean arriba = HIGH;
  const boolean abajo = LOW;
  String s1 = "Paso completado: "; String s2 = "";
  const int Num_estac = 2;
  const int Pls_por_est = 667;

// Configuracion
void setup() {
  // Configurar pines como salidas
  pinMode(Pin_succion, OUTPUT);
  pinMode(Pin_enable, OUTPUT);
  pinMode(Pin_dirX, OUTPUT);
  pinMode(Pin_stepX, OUTPUT);
  pinMode(Pin_dirY, OUTPUT);
  pinMode(Pin_stepY, OUTPUT);
  attachInterrupt(0, limiteX, LOW); //INT=0 -> Interrupción externa = Pin2; INT=1 -> Interrupción externa = Pin3
  digitalWrite(Pin_succion,HIGH); //apagar el relay
  Serial.begin(9600);

}
// Main
void loop() {
  for (int j=1; j <= Num_estac; j++){
      // Cargar semillas
      mover(2, 100, arriba, 100);   // Motor 2, 50 pasos arriba a 200 pps
      succionar(2500);
      mover(2, 100, abajo, 100);    // Motor 2, 50 pasos abajo a 200 pps
      // Mover semillas a estación j
      mover(1,Pls_por_est*j,adelante, 200); // Motor 1, 50*j pasos adelante a 200 pps
      // Depositar semillas en estación j
      soplar(2500);
      // Volver a depósito de semillas
      mover(1,Pls_por_est*j,atras, 200);    // Motor 1, 50*j pasos atrás a 200 pps
      s2 = s1 + j;                // Mensaje de etapa completada
      Serial.println(s2);
  }
 }

// Función mover
void mover(int motor, long pasos, boolean direccion, long velocidad){
  long semiciclo; // Duración de semiciclo
  semiciclo = (long) 500/velocidad; // 1000(ms/s) * (1/2) / v
  
  if (motor==1) {
    digitalWrite(Pin_dirX, direccion); // dirección a la que sea
    digitalWrite(Pin_enable, LOW); // habilitar con LOW
  
    for (long i=0; i<=pasos; i++){
      digitalWrite(Pin_stepX, HIGH); // escribir stepX a 1
      delay(semiciclo);
      digitalWrite(Pin_stepX, LOW);// escribir stepX a 0
      delay(semiciclo);
    }
  }
  if (motor==2) {
    digitalWrite(Pin_dirY, direccion); // dirección a la que sea
    digitalWrite(Pin_enable, LOW); // habilitar con LOW
  
    for (long i=0; i<=pasos; i++){
      digitalWrite(Pin_stepY, HIGH); // escribir stepY a 1
      delay(semiciclo);
      digitalWrite(Pin_stepY, LOW);// escribir stepY a 0
      delay(semiciclo);
    }
  }
}
void succionar(int tiempo){
  digitalWrite(Pin_succion, LOW);
  delay(tiempo); // Orden de hacer vacío
}
void soplar(int tiempo){
  delay(tiempo); // Orden de soplar
  digitalWrite(Pin_succion, HIGH);
  delay(tiempo); // Orden de soplar
}
void limiteX()
{
  digitalWrite(Pin_enable,HIGH); // habilitacion de motor activo bajo
}
